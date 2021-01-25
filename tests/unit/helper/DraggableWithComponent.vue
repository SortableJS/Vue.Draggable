<template>
  <draggable
    :list="array"
    tag="fake"
    :component-data="{ prop1: 'my-id' }"
    :item-key="key => key"
  >
    <template #item="{element}">
      <div>{{ element }}</div>
    </template>
  </draggable>
</template>
<script>
import draggable from "@/vuedraggable";

export default {
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
