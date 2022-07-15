<template>
  <div>
    <q-dialog v-model="showDialog">
      <q-card class="subcategory-card">
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>{{ dialogTitle }}</q-toolbar-title>
        </q-toolbar>

        <q-card-section>
          <q-form ref="form" class="form">
            <div class="text-negative">{{ dialogMessage }}</div>

            <q-input
              v-model="tempSubcategory.name"
              dense
              outlined
              autofocus
              maxlength="20"
              :rules="[ValidationUtil.isRequired]"
              label="Subcategory"
              required
            />

            <!-- Match Text list -->
            <fieldset class="text-mappings rounded-borders">
              <legend>Match Text</legend>

              <q-list dense class="matchtext-list">
                <q-item v-for="(matchText, idx) in tempSubcategory.matchText" :key="idx" dense>
                  <q-item-section> {{ matchText }} </q-item-section>
                  <q-item-section side>
                    <q-btn
                      flat
                      round
                      size="sm"
                      icon="mdi-delete"
                      color="primary"
                      title="Delete Match Text"
                      @click="deleteMatchText(matchText, idx)"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </fieldset>

            <!-- New match text to add -->
            <div class="q-pt-lg">
              <q-space />
              <q-input v-model="newMatchText" dense outlined label="New Match Text">
                <template #append>
                  <q-btn
                    size="sm"
                    icon="mdi-plus"
                    color="primary"
                    title="Add Match Text"
                    class="icon-btn"
                    @click="addMatchText"
                  />
                </template>
              </q-input>
            </div>
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat color="primary" @click="close">Cancel</q-btn>
          <q-btn flat color="primary" @click="save">Save</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import CategoryService from '@/services/category'
  import { cloneDeep } from 'lodash-es'
  import { Category, Subcategory } from '@/types/category'
  import ValidationUtil from '@/util/validation'
  import { v4 as uuidv4 } from 'uuid'
  import { QForm } from 'quasar'

  const props = defineProps<{
    modelValue: boolean
    category: Category
    subcategory?: Subcategory
  }>()

  const emit = defineEmits(['update:modelValue', 'subcategory-updated', 'subcategory-added'])

  const form = ref<QForm | null>(null)

  const dialogTitle = computed(() => {
    if (!props.subcategory?.id) {
      return 'Add Subcategory'
    }
    return 'Update Subcategory'
  })

  const showDialog = computed({
    get() {
      return props.modelValue
    },
    set(newValue) {
      emit('update:modelValue', newValue)
    },
  })

  const dialogMessage = ref<string>()
  const newMatchText = ref<string>()
  const tempCategory = ref<Category>(cloneDeep(props.category))
  const tempSubcategory = ref<Subcategory>({ id: '', name: '', matchText: [] })

  if (props.subcategory) {
    tempSubcategory.value = cloneDeep(props.subcategory)
  }

  // Save the category with updated subcategory
  function save() {
    dialogMessage.value = undefined
    form.value!.validate().then(async (valid) => {
      if (valid) {
        // Verify the subcategory is unique within the category before saving
        if (isSubcategoryUnique()) {
          if (props.subcategory) {
            // Update the subcategory in the category's subcategories
            const index = tempCategory.value.subcategories.findIndex(
              (subcat) => subcat.name === props.subcategory!.name
            )
            if (index !== -1) {
              tempCategory.value.subcategories[index] = tempSubcategory.value
            }
          } else {
            // Add the subcategory to the category's subcategories
            tempSubcategory.value.id = 'S' + uuidv4()
            tempCategory.value.subcategories.push(tempSubcategory.value)
          }

          tempCategory.value.subcategories.sort((sub1, sub2) => {
            return sub1.name.toLowerCase().localeCompare(sub2.name.toLowerCase())
          })

          try {
            await CategoryService.saveCategory(tempCategory.value)
            // Emit the subcategory-updated event
            if (!props.subcategory?.id) {
              emit('subcategory-added', tempCategory.value, tempSubcategory.value)
            } else {
              emit('subcategory-updated', tempCategory.value, tempSubcategory.value)
            }
            // Close the dialog
            close()
          } catch (error) {
            console.error('Error saving subcategory:', error)
            dialogMessage.value = 'Error saving the Subcategory'
          }
        } else {
          dialogMessage.value = 'Subcategory name is not unique'
        }
      }
    })
  }

  // Determine if the subcategory name is unique within the category
  function isSubcategoryUnique() {
    // First check that if name is unchanged from original
    if (props.subcategory) {
      if (tempSubcategory.value.name.toLowerCase() === props.subcategory.name.toLowerCase()) {
        return true
      }
    }

    // Now check to see if subcategory name is already used within the category
    const idx = tempCategory.value.subcategories.findIndex(
      (subcat) => subcat.name.toLowerCase() === tempSubcategory.value.name.toLowerCase()
    )
    if (idx !== -1) {
      return false
    }
    return true
  }

  // Close the dialog
  function close() {
    emit('update:modelValue', false)
  }

  // Add match text to the subcategory
  function addMatchText() {
    dialogMessage.value = undefined
    if (!newMatchText.value) {
      return
    }

    if (!tempSubcategory.value.matchText) {
      tempSubcategory.value.matchText = []
    }

    // Verify the new matchtext is unique within the subcategory before adding it
    const idx = tempSubcategory.value.matchText.findIndex(
      (match) => match.toLowerCase() === newMatchText.value?.toLowerCase()
    )
    if (idx === -1) {
      tempSubcategory.value.matchText.push(newMatchText.value)

      // Sort the matchtext
      tempSubcategory.value.matchText.sort((a, b) => {
        if (a.toLowerCase() < b.toLowerCase()) {
          return -1
        }
        if (a.toLowerCase() > b.toLowerCase()) {
          return 1
        }
        return 0
      })
    }
    newMatchText.value = undefined
  }

  // Delete match text from the subcategory
  function deleteMatchText(text: string, idx: number) {
    dialogMessage.value = undefined
    tempSubcategory?.value?.matchText?.splice(idx, 1)
  }
</script>

<style lang="scss" scoped>
  .matchtext-list {
    height: 100px;
    overflow-y: auto;
  }
  .text-mappings {
    border: solid 1px #9a9a9a;
  }
  .subcategory-card {
    width: 450px;
  }
  @media (max-width: $breakpoint-xs-max) {
    .subcategory-card {
      width: 70vh;
    }
  }
</style>
