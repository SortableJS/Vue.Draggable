<template>
  <div class="justify-content-center jumbotron">
    <div class="row">
      <div class="col-1">
        <button
          class="btn btn-secondary button"
          @click="add"
        >Add</button>
      </div>

      <div class="col-7">
        <h3>Draggable {{ draggingInfo }}</h3>

        <draggable
          element="ul"
          :list="list"
          class="list-group"
          :options="{ handle: '.handle' }"
        >
          <li
            class="list-group-item"
            v-for="(element, idx) in list"
            :key="element.name"
          >
            <i class="fa fa-align-justify handle"></i>

            <span class="text">{{ element.name }} </span>

            <input
              type="text"
              class="form-control"
              v-model="element.text"
            />

            <i
              class="fa fa-times close"
              @click="removeAt(idx)"
            ></i>
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
let id = 3;
import draggable from "@/vuedraggable";
import rawDisplayer from "./raw-displayer.vue";
export default {
  name: "handler",
  components: {
    draggable,
    rawDisplayer
  },
  data() {
    return {
      list: [
        { name: "John", text: "", id: 0 },
        { name: "Joao", text: "", id: 1 },
        { name: "Jean", text: "", id: 2 }
      ],
      dragging: false
    };
  },
  computed: {
    draggingInfo() {
      return this.dragging ? "under drag" : "";
    }
  },
  methods: {
    removeAt(idx) {
      this.list.splice(idx, 1);
    },
    add: function() {
      id++;
      this.list.push({ name: "Juan " + id, id, text: "" });
    }
  }
};
</script>
<style scoped>
.button {
  margin-top: 35px;
}
.handle {
  float: left;
  padding-top: 8px;
  padding-bottom: 8px;
}

.close {
  float: right;
  padding-top: 8px;
  padding-bottom: 8px;
}

input {
  display: inline-block;
  width: 50%;
}

.text {
  margin: 20px;
}
</style>
