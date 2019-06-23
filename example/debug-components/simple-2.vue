<template>
  <div class="row">
    <div class="col-2">
      <div class="form-group">
        <div
          class="btn-group-vertical buttons"
          role="group"
          aria-label="Basic example"
        >
          <button
            class="btn btn-secondary"
            @click="add"
          >Add</button>
          <button
            class="btn btn-secondary"
            @click="replace"
          >Replace</button>
        </div>

        <div class="form-check">
          <input
            id="disabled"
            type="checkbox"
            v-model="enabled"
            class="form-check-input"
          />
          <label
            class="form-check-label"
            for="disabled"
          >DnD enabled</label>
        </div>
      </div>
    </div>

    <div class="col-6">
      <h3>Draggable</h3>

      <draggableList
        :list="list"
        :enabled="enabled"
      />
    </div>

    <rawDisplayer
      class="col-3"
      :value="list"
      title="List"
    />
  </div>
</template>

<script>
import draggableList from "./nested/draggable-list";

let id = 1;
export default {
  name: "simple-2",
  display: "Simple 2",
  order: 1,
  debug: true,
  components: {
    draggableList
  },
  data() {
    return {
      enabled: true,
      list: [
        { name: "John", id: 0 },
        { name: "Joao", id: 1 },
        { name: "Jean", id: 2 }
      ],
    };
  },
  methods: {
    add: function() {
      this.list.push({ name: "Juan " + id, id: id++ });
    },
    replace: function() {
      this.list = [{ name: "Edgard", id: id++ }];
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
