<template>
  <div class=" justify-content-center jumbotron">
    <div class="row">
      <div class="col-3">
        <h3>Draggable for list 1</h3>
        <draggable
          class="dragArea list-group"
          :list="list1"
          :options="{ group: { name: 'people', pull: 'clone', put: false } }"
          @change="log"
        >
          <div
            class="list-group-item"
            v-for="(element, index) in list1"
            :key="element.name"
          >
            {{ element.name }} {{ index }}
          </div>
        </draggable>
      </div>

      <div class="col-3">
        <h3>Draggable for list 2</h3>
        <draggable
          class="dragArea list-group"
          :list="list2"
          :options="{ group: 'people' }"
          @change="log"
        >
          <div
            class="list-group-item"
            v-for="(element, index) in list2"
            :key="element.name"
          >
            {{ element.name }} {{ index }}
          </div>
        </draggable>
      </div>

      <rawDisplayer class="col-3" :value="list1" title="List 1" />

      <rawDisplayer class="col-3" :value="list2" title="List 2" />
    </div>
  </div>
</template>

<script>
import draggable from "@/components/Vuedraggable";
import rawDisplayer from "./raw-displayer.vue";
export default {
  name: "clone",
  components: {
    draggable,
    rawDisplayer
  },
  data() {
    return {
      list1: [
        { name: "John", id: 1 },
        { name: "Joao", id: 2 },
        { name: "Jean", id: 3 },
        { name: "Gerard", id: 4 }
      ],
      list2: [
        { name: "Juan", id: 5 },
        { name: "Edgard", id: 6 },
        { name: "Johnson", id: 7 }
      ]
    };
  },
  methods: {
    log: function(evt) {
      window.console.log(evt);
    }
  }
};
</script>
<style scoped></style>
