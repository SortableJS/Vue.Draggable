<template>
  <div>
    <div class="row">
      <div class="col">
        <h3>Press Ctrl to clone element from list 1</h3>
      </div>
    </div>
    <div class="row">
      <div class="col-3">
        <h3>Draggable 1</h3>
        <draggable
          class="dragArea list-group"
          :list="list1"
          :clone="clone"
          :group="{ name: 'people', pull: pullFunction }"
          @start="start"
        >
          <div
            class="list-group-item"
            v-for="element in list1"
            :key="element.id"
          >
            {{ element.name }}
          </div>
        </draggable>
      </div>

      <div class="col-3">
        <h3>Draggable 2</h3>
        <draggable class="dragArea list-group" :list="list2" group="people">
          <div
            class="list-group-item"
            v-for="element in list2"
            :key="element.id"
          >
            {{ element.name }}
          </div>
        </draggable>
      </div>

      <rawDisplayer class="col-3" :value="list1" title="List 1" />

      <rawDisplayer class="col-3" :value="list2" title="List 2" />
    </div>
  </div>
</template>

<script>
import draggable from "@/vuedraggable";
let idGlobal = 8;
export default {
  name: "clone-on-control",
  display: "Clone on Control",
  order: 4,
  components: {
    draggable
  },
  data() {
    return {
      list1: [
        { name: "Jesus", id: 1 },
        { name: "Paul", id: 2 },
        { name: "Peter", id: 3 }
      ],
      list2: [
        { name: "Luc", id: 5 },
        { name: "Thomas", id: 6 },
        { name: "John", id: 7 }
      ],
      controlOnStart: true
    };
  },
  methods: {
    clone({ name }) {
      return { name, id: idGlobal++ };
    },
    pullFunction() {
      return this.controlOnStart ? "clone" : true;
    },
    start({ originalEvent }) {
      this.controlOnStart = originalEvent.ctrlKey;
    }
  }
};
</script>
<style scoped></style>
