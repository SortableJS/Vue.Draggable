<template>
  <div class="row">
    <div class="col-8">
      <h3>Draggable with footer</h3>

      <draggable
        tag="transition-group"
        :componentData="componentData"
        :list="list"
        :animation="100"
        @start="dragging = true"
        @end="dragging = false"
        item-key="name"
      >
        <template #item="{ element }">
          <div class="list-group-item">
            {{ element.name }}
          </div>
        </template>

        <template #footer>
          <div
            class="btn-group list-group-item"
            role="group"
            aria-label="Basic example"
            key="footer"
          >
            <button class="btn btn-secondary" @click="add">Add</button>
            <button class="btn btn-secondary" @click="replace">Replace</button>
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
  name: "footerslot",
  display: "Footer slot",
  order: 12,
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
        type: "transition",
        name: "flip-list"
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
