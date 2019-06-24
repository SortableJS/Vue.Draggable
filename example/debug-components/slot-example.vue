<template>
  <div class="row">
    <div class="col-2">
      <div class="form-group">
        <div
          class="btn-group-vertical buttons"
          role="group"
          aria-label="Basic example"
        >
          <button class="btn btn-secondary" @click="add">Add</button>
          <button class="btn btn-secondary" @click="remove">Remove</button>
          <button class="btn btn-secondary" @click="clear">Clear</button>
        </div>
      </div>
    </div>

    <div class="col-6">
      <h3>Draggable</h3>

      <draggable
        :list="list"
        :disabled="!enabled"
        class="list-group"
        ghost-class="ghost"
      >
        <div
          class="list-group-item"
          v-for="element in list"
          :key="element.name"
        >
          {{ element.name }}
        </div>

        <template v-slot:header>
          <div>
            header slot
          </div>
        </template>

        <template v-slot:footer>
          <div>
            footer slot
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
  name: "slot-example",
  display: "Slot example",
  order: 1,
  debug: true,
  components: {
    draggable
  },
  data() {
    return {
      enabled: true,
      list: [
        { name: "John", id: 0 },
        { name: "Joao", id: 1 },
        { name: "Jean", id: 2 }
      ]
    };
  },
  methods: {
    clear: function() {
      this.list = [];
    },
    add: function() {
      this.list.push({ name: "Juan " + id, id: id++ });
    },
    remove: function() {
      this.list.pop();
    }
  }
};
</script>
<style scoped>
.buttons {
  margin-top: 35px;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
