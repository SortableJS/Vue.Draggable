<template>
  <draggable v-model="array">
    <transition-group>
      <div
        v-for="item in array"
        :key="item"
      >{{item}}</div>
    </transition-group>
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
