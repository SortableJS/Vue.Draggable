<template>
  <div class="row">
    <div class="col-8">
      <h3>Draggable Table</h3>

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
            <tr :key="item.id">
              <td scope="row">{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.sport }}</td>
            </tr>
            <th v-if="item.open" :key="`${item.id}_col`">
              <div class="CollapsibleContent">
                Hi! You can writing detail in here for {{ item.name }}
              </div>
            </th>
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
        { id: 1, name: "Abby", sport: "basket", open: true },
        { id: 2, name: "Brooke", sport: "foot" },
        { id: 3, name: "Courtenay", sport: "volley", open: true },
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
.CollapsibleContent {
  padding: 20px;
  width: 100%;
  display: flex;
  border: 1px solid #ddd;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
