<template>
  <div class="row">
    <div class="col-8">
      <h3>Draggable with footer</h3>

      <draggable
        tag="transition-group"
        :componentData="componentData"
        :list="list"
        class="list-group"
        draggable=".item"
        :animation="100"
        @start="dragging = true"
        @end="dragging = false"
      >
        <div
          class="list-group-item item"
          v-for="element in list"
          :key="element.name"
        >
          {{ element.name }}
        </div>

        <div
          slot="footer"
          class="btn-group list-group-item"
          role="group"
          aria-label="Basic example"
          key="footer"
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
      </draggable>
    </div>

    <rawDisplayer
      class="col-3"
      :value="list"
      title="List"
    />
  </div>
</template>

<script>
import draggable from "@/vuedraggable";
let id = 1;
export default {
  name: "footerslot",
  display: "Footer slot",
  order: 11,
  components: {
    draggable
  },
  data() {
    return {
      list: [
        { name: "John", id: 0 },
        { name: "Joao", id: 1 },
        { name: "Jean", id: 2 }
      ],
      dragging: false,
      componentData: {
        props: {
          type: "transition",
          name: "flip-list"
        }
      }
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
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}
</style>
