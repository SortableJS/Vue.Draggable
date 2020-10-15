<template>
  <div class="row">
    <div class="col-8">
      <h3>Draggable Table With Vıf</h3>

      <table class="table table-striped">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Name</th>
            <th scope="col">Sport</th>
          </tr>
        </thead>
        <draggable v-model="list" tag="tbody">
          <template v-for="item in list">
            <tr v-if="list.length > 10" :key="item.id">
              <td>{{ item.job }}</td>
            </tr>
            <tr :key="item.name">
              <td scope="row">{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.sport }}</td>
            </tr>
          </template>
        </draggable>
      </table>
    </div>

    <rawDisplayer class="col-3" :value="list" title="List" />
  </div>
</template>

<script>
import draggable from "@/vuedraggable";
export default {
  name: "table-with-vif-example",
  display: "TableWithVıfExample",
  order: 20,
  components: {
    draggable
  },
  data() {
    return {
      list: [
        { id: 1, name: "Abby", sport: "basket", job: "engineer" },
        { id: 2, name: "Brooke", sport: "foot", job: "lawyer" },
        { id: 3, name: "Courtenay", sport: "volley", job: "developer" },
        { id: 4, name: "David", sport: "rugby", job: "sport" }
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
