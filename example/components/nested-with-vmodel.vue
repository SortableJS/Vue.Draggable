<template>
  <div class="justify-content-between row">
    <nested-test class="col-8" v-model="elements" />
    <raw-displayer class="col-4" :title="'Vuex Store'" :value="elements" />
  </div>
</template>

<script>
import NestedTest from "./nested/nested-test.vue";
import rawDisplayer from "./infra/raw-displayer.vue";

export default {
  name: "nested-with-vmodel",
  display: "Nested (v-model & vuex)",
  order: 16,
  components: {
    NestedTest,
    rawDisplayer
  },
  computed: {
    elements: {
      get() {
        return this.$store.state.nested.elements;
      },
      set(value) {
        this.$store.dispatch("nested/updateElements", value);
      }
    }
  },
  methods: {}
};
</script>
