<template>
  <div class="row">
    <div class="col-8">
      <h3>Draggable with header</h3>

      <draggable
        :list="list"
        class="list-group"
        @start="dragging = true"
        @end="dragging = false"
        @change="log"
        item-key="name"
      >
        <template #header>
          <div class="btn-group list-group-item" role="group">
            <button class="btn btn-secondary" @click="add">Add</button>
          </div>
        </template>

        <template #footer>
          <div class="btn-group list-group-item" role="group">
            <button class="btn btn-secondary" @click="replace">Replace</button>
          </div>
        </template>

        <template #item="{ element }">
          <div class="list-group-item item">
            {{ element.name }}
          </div>
        </template>
      </draggable>
    </div>

    <rawDisplayer class="col-3" :value="list" title="List" />
  </div>
</template>

<script>
import draggable from "@/vuedraggable";
let id = 1;
export default {
  name: "headerslot",
  display: "Header slot",
  order: 13,
  components: {
    draggable
  },
  data() {
    return {
      list: [
        { name: "John 1", id: 0 },
        { name: "Joao 2", id: 1 },
        { name: "Jean 3", id: 2 }
      ],
      dragging: false
    };
  },
  methods: {
    add: function() {
      this.list.push({ name: "Juan " + id, id: id++ });
    },
    replace: function() {
      this.list = [{ name: "Edgard", id: id++ }];
    },
    log: function(evt) {
      window.console.log(evt);
    }
  }
};
</script>
<style scoped></style>
