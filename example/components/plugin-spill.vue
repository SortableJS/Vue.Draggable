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
          <button class="btn btn-secondary" @click="replace">Replace</button>
        </div>
      </div>
    </div>

    <div class="col-3">
      <h3>Draggable - RevertOnSpill</h3>

      <draggable
        :list="list"
        class="list-group"
        :revert-on-spill="true"
        @spill="() => logSpilled('revert')"
      >
        <div
          class="list-group-item"
          v-for="element in list"
          :key="element.name"
        >
          {{ element.name }}
        </div>
      </draggable>
    </div>

    <div class="col-3">
      <h3>Draggable - RemoveOnSpill</h3>

      <draggable
        :list="list"
        class="list-group"
        :remove-on-spill="true"
        @spill="() => logSpilled('remove')"
      >
        <div
          class="list-group-item"
          v-for="element in list"
          :key="element.name"
        >
          {{ element.name }}
        </div>
      </draggable>
    </div>

    <rawDisplayer class="col-3" :value="list" title="List" />
  </div>
</template>

<script>
import draggable from "@/vuedraggable";
let id = 1;
export default {
  name: "plugin-spill",
  display: "Plugin: Spill",
  order: 18,
  components: {
    draggable
  },
  data() {
    return {
      list: [
        { name: "John", id: 0 },
        { name: "Joao", id: 1 },
        { name: "Jean", id: 2 }
      ]
    };
  },
  methods: {
    add: function() {
      this.list.push({ name: "Juan " + id, id: id++ });
    },
    replace: function() {
      this.list = [{ name: "Edgard", id: id++ }];
    },
    logSpilled: function(type) {
      window.console.log(`Spilled: ${type}`);
    }
  }
};
</script>
<style scoped>
.buttons {
  margin-top: 35px;
}
</style>
