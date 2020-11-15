<template>
  <div id="root">
    <draggable :list="array" tag="FragmentRoot" :item-key="key => key">
      <template #item="{element, index }">
        <div>{{ element }}-{{ index }}</div>
      </template>
    </draggable>
  </div>
</template>
<script>
import draggable from "@/vuedraggable";

export default {
  components: {
    draggable
  },
  data() {
    return {
      array: ["a", "b", "c"]
    };
  }
};
</script>
