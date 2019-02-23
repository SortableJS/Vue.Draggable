<template>
  <div class="row">
    <div class="col-8">
      <h3>Draggable table</h3>

      <table class="table table-striped">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Name</th>
          </tr>
        </thead>
        <draggable v-model="list" :element="'tbody'">
          <tr v-for="item in list" :key="item.name">
            <th scope="row">{{ item.id }}</th>
            <td>{{ item.name }}</td>
          </tr>
        </draggable>
      </table>
    </div>

    <rawDisplayer class="col-3" :value="list" title="List" />
  </div>
</template>

<script>
import draggable from "@/vuedraggable";
export default {
  name: "table-example",
  display: "Table",
  components: {
    draggable
  },
  data() {
    return {
      list: [
        { id: 1, name: "Abby" },
        { id: 2, name: "Brooke" },
        { id: 3, name: "Courtenay" },
        { id: 4, name: "David" }
      ],
      dragging: false
    };
  }
};
</script>
<style scoped>
.buttons {
  margin-top: 35px;
}
</style>
