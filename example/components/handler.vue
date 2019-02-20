<template>
  <div class="justify-content-center jumbotron">
    <div class="row">
      <div class="col-8">
        <h3>Draggable {{ draggingInfo }}</h3>

        <draggable
          element="ul"
          :list="list"
          class="list-group"
          :options="{ handle: '.handle' }"
        >
          <li
            class="list-group-item"
            v-for="element in list"
            :key="element.name"
          >
            <i class="fa fa-align-justify handle"></i>

            {{ element.name }}
          </li>
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
import draggable from "@/vuedraggable";
import rawDisplayer from "./raw-displayer.vue";
let id = 1;
export default {
  name: "header",
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
    }
  }
};
</script>
<style scoped>
.buttons {
  margin-top: 50px;
}
.handle {
  float: left;
}
</style>
