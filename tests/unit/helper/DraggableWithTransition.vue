<template>
  <draggable
    tag="transition-group"
    :component-data="{ tag: 'div' }"
    v-model="array"
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
