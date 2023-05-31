<template>
  <div class="justify-content-between row">
    <nested-test class="col-8" v-model="list" />
    <raw-displayer class="col-4" :title="'Vuex Store'" :value="list" />
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
  data: function() {
    return {
      list: this.$store.state.nested.elements
    };
  },
  watch: {
    list: {
      handler: function(val) {
        this.$store.dispatch("nested/updateElements", val);
      },
      deep: true
    }
  },
  methods: {}
};
</script>
