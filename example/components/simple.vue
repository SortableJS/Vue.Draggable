<template>
  <div>
    <div class="row justify-content-center jumbotron">

      <div class="col-2">
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
      </div>

      <div class="list-group col-6">
        <h2>Draggable {{draggingInfo}}</h2>

        <draggable
          :list="list"
          @start="dragging=true"
          @end="dragging=false"
        >
          <div
            class="list-group-item"
            v-for="element in list"
            :key="element.name"
          >{{element.name}}</div>
        </draggable>
      </div>

      <rawDisplayer
        class="col-3"
        :value="list"
        title="List"
      />

    </div>

  </div>
</template>

<script>
import draggable from "@/components/Vuedraggable";
import rawDisplayer from "./raw-displayer.vue";
let id = 1;
export default {
  name: "simple",
  components: {
    draggable,
    rawDisplayer
  },
  data() {
    return {
      list: [
        { name: "John", id: 0 },
        { name: "Joao", id: 1 },
        { name: "Jean", id: 2 }
      ],
      dragging: false
    };
  },
  computed: {
    draggingInfo() {
      return this.dragging ? "under drag" : "";
    },
    listString() {
      return JSON.stringify(this.list, null, 2);
    }
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
  margin-top: 50px;
}
</style>

