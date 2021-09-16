<template>
  <div class="row">
    <div class="col-6">
      <h3>Grid</h3>

      <draggable
        :list="list"
        ghost-class="ghost"
        :disabled="!enabled"
        class="col"
      >
        <div class="grid-square" v-for="element in list" :key="element.id">
          {{ element.name }}
        </div>
      </draggable>
    </div>

    <rawDisplayer class="col-3" :value="list" title="List" />
  </div>
</template>

<script>
import draggable from "@/vuedraggable";
export default {
  name: "grid",
  display: "Grid",
  order: 18,
  components: {
    draggable
  },
  data() {
    return {
      enabled: true,
      list: [
        { name: "Item 0", id: 0 },
        { name: "Item 1", id: 1 },
        { name: "Item 2", id: 2 },
        { name: "Item 3", id: 3 },
        { name: "Item 4", id: 4 },
        { name: "Item 5", id: 5 },
        { name: "Item 6", id: 6 },
        { name: "Item 7", id: 7 }
      ]
    };
  }
};
</script>
<style scoped>
.col {
  padding-right: 0;
  margin-right: 15px;
}
.grid-square {
  font-size: 15px;
  width: 100px;
  height: 100px;
  display: inline-block;
  background-color: wheat;
  border: solid 1px black;
  padding: 10px;
  margin: 12px;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
