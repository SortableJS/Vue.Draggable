<template>

  <draggable
    :list="list"
    :disabled="!enabled"
    class="list-group"
    ghost-class="ghost"
    :move="checkMove"
    @start="dragging = true"
    @end="dragging = false"
  >
    <div
      class="list-group-item"
      v-for="element in list"
      :key="element.name"
    >
      {{ element.name }}
    </div>
  </draggable>
</template>

<script>
import draggable from "@/vuedraggable";
let id = 1;
export default {
  name: "draggable-list",
  components: {
    draggable
  },
  props: {
    list: {
      type: Array,
      required: true
    },
    enabled: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      dragging: false
    };
  },
  computed: {
    draggingInfo() {
      return this.dragging ? "under drag" : "";
    }
  },
  methods: {
    add: function() {
      this.list.push({ name: "Juan " + id, id: id++ });
    },
    replace: function() {
      this.list = [{ name: "Edgard", id: id++ }];
    },
    checkMove: function(e) {
      window.console.log("Future index: " + e.draggedContext.futureIndex);
    }
  }
};
</script>
<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
