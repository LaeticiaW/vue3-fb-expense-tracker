<template>
  <q-dialog v-model="showImportDialog">
    <q-card class="import-card">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>Import Expenses</q-toolbar-title>
      </q-toolbar>

      <q-separator />

      <q-card-section>
        <q-form ref="form" v-model="isFormValid" greedy>
          <div v-if="dialogMessage" class="text-negative q-pb-md">
            {{ dialogMessage }}
          </div>

          <div class="row form-row">
            <div class="col-xs-12 col-sm-6 first-column">
              <div class="form-column rounded-borders relative-position full-height">
                <div class="bg-secondary bold q-pa-sm rounded-borders">File Info</div>

                <q-separator class="q-mb-sm" />

                <div class="q-pa-md full-height">
                  <q-file
                    v-model="fileInfo.csvFile.value"
                    dense
                    outlined
                    no-error-icon
                    label="File Name"
                    :rules="[ValidationUtil.isRequired]"
                    class="form-item"
                  />

                  <q-input
                    v-model="fileInfo.description.value"
                    dense
                    outlined
                    no-error-icon
                    label="Description"
                    :rules="[ValidationUtil.isRequired]"
                    class="form-item"
                  />

                  <q-select
                    v-model="fileInfo.dateFormat.value"
                    outlined
                    dense
                    options-dense
                    emit-value
                    map-options
                    no-error-icon
                    :options="dateFormats"
                    label="Date Format"
                    class="form-item"
                    :rules="[ValidationUtil.isRequired]"
                  />

                  <q-checkbox
                    v-model="fileInfo.negativeExpenses.value"
                    label="Expenses are Negative"
                    color="primary"
                  />
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6">
              <div class="form-column rounded-borders relative-position full-height">
                <div class="bg-secondary bold q-pa-sm rounded-borders">File Structure</div>

                <q-separator class="q-mb-sm" />

                <div class="q-pa-md full-height">
                  <q-select
                    v-model="fileStructure.dateFormatField.value"
                    outlined
                    dense
                    options-dense
                    emit-value
                    map-options
                    no-error-icon
                    :options="fieldPositions"
                    label="Date Field Position"
                    class="form-item"
                    :rules="[ValidationUtil.isRequired, ValidationUtil.isNumber]"
                  />

                  <q-select
                    v-model="fileStructure.amountField.value"
                    outlined
                    dense
                    options-dense
                    emit-value
                    map-options
                    no-error-icon
                    :options="fieldPositions"
                    label="Amount Field Position"
                    class="form-item"
                    :rules="[ValidationUtil.isRequired, ValidationUtil.isNumber]"
                  />

                  <q-select
                    v-model="fileStructure.descriptionField.value"
                    outlined
                    dense
                    options-dense
                    emit-value
                    map-options
                    no-error-icon
                    :options="fieldPositions"
                    label="Description Field Position"
                    class="form-item"
                    :rules="[ValidationUtil.isRequired, ValidationUtil.isNumber]"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat color="primary" class="cancel-button" @click="close">Cancel</q-btn>
        <q-btn flat color="primary" :disable="!initialized" @click="importExpenses">Import</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { ref, computed, ComputedRef } from 'vue'
  import dayjs from 'dayjs'
  import { Import, ImportDetails, ImportFileInfo, ImportFileStructure } from '@/types/import'
  import { QueryResponse } from '@/types/query'
  import { Expense } from '@/types/expense'
  import { Category, Subcategory } from '@/types/category'
  import useCategories from '@/hooks/data/useCategories'
  import ValidationUtil from '@/util/validation'
  import { useDialog } from '@/hooks/useDialog'

  const props = defineProps<{
    modelValue: boolean
  }>()

  const emit = defineEmits(['update:modelValue', 'file-imported'])

  const initialized = ref(false)
  const isFormValid = ref(true)
  let fileInfo: ImportFileInfo = {
    csvFile: ref(),
    dateFormat: ref(),
    negativeExpenses: ref<boolean>(false),
    description: ref(),
  }
  let fileStructure: ImportFileStructure = {
    hasHeaderRow: ref(false),
    dateFormatField: ref(),
    amountField: ref(),
    descriptionField: ref(),
  }
  const dialogMessage = ref<string>()
  const importRecords = ref<string[]>([])
  const dateFormats = [
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
    { value: 'MM-DD-YYYY', label: 'MM-DD-YYYY' },
  ]
  const fieldPositions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
    { value: 9, label: '9' },
    { value: 10, label: '10' },
  ]

  const { showDialog } = useDialog()

  const showImportDialog = computed({
    get() {
      return props.modelValue
    },
    set(newValue: boolean) {
      emit('update:modelValue', newValue)
    },
  })

  // Retrieve the category list
  let categoriesQuery: ComputedRef<QueryResponse<Category[]>>
  try {
    categoriesQuery = useCategories()
    initialized.value = true
  } catch (error) {
    dialogMessage.value =
      'Error retrieving categories, import can continue but ' +
      'categories/subcategory will not be added to imported expenses'
  }

  // Import the expenses from the CSV file
  async function importExpenses() {
    dialogMessage.value = undefined
    const expenses: Expense[] = []

    // Validate the form fields before importing
    // if (!this.$refs.form.validate()) {
    //   return
    // }

    // Read the records from the import file
    try {
      importRecords.value = await readImportFile()
    } catch (error) {
      console.error('Error importing file:', error)
      dialogMessage.value = 'Unable to import the file'
    }

    if (!importRecords.value.length) {
      dialogMessage.value = 'No records to import'
      return
    }

    // Parse out the first record of the file for the confirmation dialog
    const parsedExpense: Expense | undefined = getExpenseObject(
      importRecords[fileStructure.hasHeaderRow ? 1 : 0],
      false
    )
    if (parsedExpense) {
      // Create the confirmation message and ask the user to confirm the import record parsing
      const msg =
        `${
          '<div>Parsed fields from the first record are displayed below.' +
          ' Are you sure you want to continue the import?</div>' +
          '<br/>' +
          "<div><label style='font-weight: bold;'>Date: </label><span>"
        }${parsedExpense.trxDate}</span></div>` +
        '<div>' +
        '  <label style="font-weight: bold;">Amount: </label>' +
        `  <span>${parsedExpense.amount}</span>` +
        '</div>' +
        '<div>' +
        '  <label style="font-weight: bold;">Desc: </label>' +
        `  <span>${parsedExpense.description}</span>` +
        '</div>'

      // Confirm the import
      /*
        showDialog({
          title: 'Confirm Import',
          message: msg,
        }).onOk(async () => {
          // Create expense objects for each import file record
          importRecords.value.forEach((rec, idx) => {
            if (!fileStructure.hasHeaderRow || idx > 0) {
              const exp = getExpenseObject(rec)
              if (exp) {
                expenses.push(exp)
              }
            }
          })

          // Create an import details summary object
          const importDetails: ImportDetails = {
            importDate: dayjs().format('YYYY-MM-DD'),
            fileName: fileInfo.csvFile.value?.name ?? '',
            description: fileInfo.description?.value,
            recordCount: expenses.length,
          }

          // Store the expenses and the import details in the db
          try {
            await ExpenseService.importExpenses(expenses, importDetails)
            emit('file-imported')
            // Close the dialog
            close()
          } catch (error) {
            console.error('Error importing expenses:', error)
            dialogMessage.value = 'Error importing expenses'
          }
        })
        */
    } else {
      dialogMessage.value = 'Unable to parse first import file record'
    }
  }

  // Read the records from the CSV file
  function readImportFile(): Promise<string[]> {
    /*
    return new Promise((resolve, reject) => {
      const fileReader: FileReader = new FileReader()
      fileReader.onload = () => {
        const records = (fileReader.result as string)?.split('\n')
        if (records[records.length - 1].length === 0) {
          records.pop()
        }
        resolve(records)
      }
      fileReader.onerror = () => {
        console.error(`Unable to read import file: ${fileReader.error}`)
        reject(`Unable to read import file: ${fileReader.error}`)
      }
      fileReader.readAsText(fileInfo.csvFile.value)
    })
    */
  }

  // Convert the CSV record into an Expense object
  function getExpenseObject(record, validate = true) {
    const fields = record.split(',')
    if (!fields.length) {
      return undefined
    }

    const expense = normalizeExpense(fields)

    // if (validate && !validate(expense)) {
    //   return undefined
    // }

    // Set the expense categoryId and subcategoryId if the expense description
    // matches a subcategory matchText
    if (expense.description) {
      categoriesQuery.value.data.forEach((cat) => {
        if (cat.subcategories) {
          cat.subcategories.forEach((subcat: Subcategory) => {
            if (subcat.matchText) {
              subcat.matchText.forEach((text) => {
                const regex = new RegExp(text, 'i')
                if (expense.description!.match(regex)) {
                  expense.categoryId = cat.id
                  expense.subcategoryId = subcat.id
                }
              })
            }
          })
        }
      })
    }

    return expense
  }

  // Copy the CSV record fields into an expense object and then normalize some of the data
  function normalizeExpense(fields) {
    const expense: Expense = {
      trxDate: fields[fileStructure.dateFormatField.value - 1],
      description: fields[fileStructure.descriptionField.value - 1],
      amount: 0,
      categoryId: undefined,
      subcategoryId: undefined,
    }

    let rawAmount: number | string = fields[fileStructure.amountField.value - 1]

    // Remove quotation marks from fields
    if (typeof expense.trxDate === 'string') {
      expense.trxDate = expense.trxDate.replace(/"/g, '')
    }
    if (typeof expense.description === 'string') {
      expense.description = expense.description.replace(/"/g, '')
    }
    if (typeof rawAmount === 'string') {
      rawAmount = rawAmount.replace(/"/g, '')
    }

    // If amount has parens, convert to minus sign
    if (typeof rawAmount === 'string' && rawAmount.substr(0, 1) === '(') {
      rawAmount.replace(/^\(/, '-')
      rawAmount.replace(/\)/g, '')
    }

    // Remove leading '$' from amount
    if (typeof rawAmount === 'string' && rawAmount.substr(0, 1) === '$') {
      rawAmount = rawAmount.substr(1)
    }

    // Convert amount to number
    expense.amount = Number(rawAmount)

    // Ensure expense amounts are positive
    if (fileInfo.negativeExpenses) {
      expense.amount *= -1
    }

    return expense
  }

  // Validate the expense object
  function validate(expense: Expense) {
    if (!isValidAmount(expense.amount)) {
      return false
    }
    if (!isValidDate(expense.trxDate, fileInfo.dateFormat)) {
      return false
    }
    return true
  }

  // Determine if an amount value is valid
  function isValidAmount(value: string | number) {
    if (value === undefined || value === null || value <= 0 || Number.isNaN(value)) {
      console.error('Invalid amount:', value)
      return false
    }
    return true
  }

  // Determine if a date value is valid
  function isValidDate(value, dateFormat: string) {
    if (!dayjs(value, dateFormat)) {
      console.error('Invalid date:', value, 'format:', dateFormat)
      return false
    }
    return true
  }

  // Close the dialog
  function close() {
    emit('update:modelValue', false)
  }
</script>

<style lang="scss" scoped>
  .form-column {
    border: solid 1px #e0e0e0;
  }
  .import-card {
    width: 600px;
  }
  @media (max-width: $breakpoint-xs-max) {
    .import-card {
      width: 70vh;
    }
  }
  .first-column {
    padding-right: 12px;
  }
  @media (max-width: $breakpoint-xs-max) {
    .first-column {
      margin-bottom: 12px;
      padding-right: 0px;
    }
  }
</style>
