<template>
  <draggable :list="array" v-bind="additionalData">
    <div v-for="item in array" :key="item">{{ item }}</div>
  </draggable>
</template>
<script>
import draggable from "@/vuedraggable";

export default {
  props: {
    additionalData: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    draggable
  },
  data() {
    return {
      array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    };
  }
};
</script>
