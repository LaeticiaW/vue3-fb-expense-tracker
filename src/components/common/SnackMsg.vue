<template>
  <!-- Common snackbar -->
  <v-snackbar
    :value="show"
    :color="options.color"
    @input="$emit('update-show', $event)"
  >
    {{ options.msg }}
    <v-btn text @click="$emit('update-show', false)">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'SnackMsg',
    props: {
      /*
       * Options object contains show, color, msg properties
       */
      options: {
        type: Object,
        required: true,
      },
    },
    emits: ['update-show'],
    computed: {
      show() {
        return this.options.show
      },
    },
  })
</script>
