<template>
  <div class="full-height">
    <q-card flat bordered class="subcategory-details full-height">
      <!-- Toolbar -->
      <q-toolbar dense flat class="bg-secondary">
        <q-toolbar-title class="details-title">Subcategory Details</q-toolbar-title>
        <q-space />
        <q-btn
          dark
          round
          size="xs"
          icon="mdi-pencil"
          color="primary"
          title="Update Subcategory"
          @click="showSubcategoryDialog = true"
        />
      </q-toolbar>

      <!-- Subcategory Details -->
      <q-card-section>
        <div class="row">
          <div class="col-xs-6 col-sm-6 col-md-4 q-pb-sm">
            <label for="name">Name:</label>
          </div>
          <div class="col-xs-6 col-sm-6 col-md-8 col-lg-9">
            <div id="name">{{ subcategory.name }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-6 col-sm-6 col-md-4 col-lg-3 q-pb-sm">
            <label for="matchText">Import Match Text:</label>
          </div>
          <div class="col-xs-6 col-sm-6 col-md-8 col-lg-9">
            <div v-for="(text, idx) in subcategory.matchText" id="matchText" :key="idx">
              {{ text }}
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Update subcategory dialog -->
    <SubcategoryDialog
      v-if="showSubcategoryDialog"
      v-model="showSubcategoryDialog"
      :category="category"
      :subcategory="subcategory"
      @subcategory-updated="subcategoryUpdated"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import SubcategoryDialog from '@/components/categories/SubcategoryDialog.vue'
  import { Category, Subcategory } from '@/types/category'

  defineProps<{
    category: Category
    subcategory: Subcategory
  }>()

  const emit = defineEmits(['category-updated'])

  const showSubcategoryDialog = ref(false)

  // Re-emit the subcategory-updated event
  function subcategoryUpdated(category: Category, subcategory: Subcategory) {
    emit('category-updated', category, subcategory)
  }
</script>

<style lang="scss" scoped>
  label {
    font-weight: bold;
  }
  .details-title {
    font-size: 1rem;
  }
  :deep(.q-btn--round) {
    min-width: 1.3rem !important;
    min-height: 1.3rem !important;
  }
</style>
