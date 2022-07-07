<template>
  <div class="full-height">
    <q-card flat bordered class="category-details full-height">
      <!-- Toolbar -->
      <q-toolbar dense flat class="bg-secondary">
        <q-toolbar-title class="details-title">Category Details</q-toolbar-title>
        <q-space />
        <q-btn
          dark
          round
          size="xs"
          icon="mdi-pencil"
          color="primary"
          title="Update Category"
          @click="showCategoryDialog = true"
        />
      </q-toolbar>

      <!-- Category Details -->
      <q-card-section>
        <div class="row">
          <div class="col-6 col-md-4 col-lg-3 q-pb-sm">
            <label for="name" class="text-weight-bold">Name:</label>
          </div>
          <div class="col-6 col-md-8 col-lg-9">
            <div id="name">{{ category.name }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col-6 col-md-4 col-lg-3 q-pb-sm">
            <label for="subcategories" class="text-weight-bold">Subcategories:</label>
          </div>
          <div class="col-6 col-md-8 col-lg-9">
            <div v-for="(subcat, idx) in category.subcategories" id="subcategories" :key="idx">
              {{ subcat.name }}
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Update category dialog -->
    <CategoryDialog
      v-if="showCategoryDialog"
      v-model="showCategoryDialog"
      :category="category"
      @category-updated="$emit('category-updated', $event)"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import CategoryDialog from '@/components/categories/CategoryDialog.vue'
  import { Category } from '@/types/category'

  defineProps<{
    category: Category
  }>()

  defineEmits(['category-updated'])

  const showCategoryDialog = ref(false)
</script>

<style lang="scss" scoped>
  label {
    // font-weight: bold;
  }
  .details-title {
    font-size: 1rem;
  }
</style>
