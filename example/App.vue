<template>
  <div id="app">
    <img
      alt="Vue logo"
      src="./assets/logo.png"
    >
    <div class="container ">

      <div class="row justify-content-center">

        <div class="list-group col-8">
          <h2>Draggable</h2>
          <draggable
            :list="list"
            @start="dragging=true"
            @end="dragging=false"
          >
            <div
              class="list-group-item"
              v-for="element in list"
              :key="element.name"
            >{{element.name}}</div>
          </draggable>
        </div>

      </div>

      <div class="row justify-content-center">

        <div class="list-group col-8">
          <h2>Normal v-for</h2>
          <div>
            <div
              class="list-group-item"
              v-for="element in list"
              :key="element.name"
            >{{element.name}}</div>
          </div>
        </div>
      </div>

      <button @click="add">Add</button>
      <button @click="replace">Replace</button>

    </div>
  </div>
</template>

<script>
import draggable from "@/components/Vuedraggable";
let id = 1;
export default {
  name: "app",
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
      dragging: false
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

<style>
.main-application {
  width: 400px;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
