<template>
  <div class="row">
    <div class="col-8">
      <h3>Draggable table</h3>

      <table class="table table-striped">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Name</th>
            <th scope="col">Sport</th>
          </tr>
        </thead>
        <draggable v-model="list" tag="tbody">
          <tr v-for="item in list" :key="item.name">
            <td scope="row">{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.sport }}</td>
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
  order: 7,
  components: {
    draggable
  },
  data() {
    return {
      list: [
        { id: 1, name: "Abby", sport: "basket" },
        { id: 2, name: "Brooke", sport: "foot" },
        { id: 3, name: "Courtenay", sport: "volley" },
        { id: 4, name: "David", sport: "rugby" }
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
