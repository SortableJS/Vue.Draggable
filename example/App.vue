<template>
  <div id="app">
    <img
      alt="Vue logo"
      src="./assets/logo.png"
    >
    <div class="container ">

      <ul
        class="nav nav-tabs"
        role="tablist"
      >
        <li class="nav-item">
          <a
            class="nav-link active"
            data-toggle="tab"
            href="#simple"
            role="tab"
            aria-controls="profile"
            aria-selected="true"
          >Simple</a>
        </li>

         <li class="nav-item">
          <a
            class="nav-link"
            data-toggle="tab"
            href="#twoLists"
            role="tab"
            aria-controls="profile"
            aria-selected="false"
          >Two Lists</a>
        </li>

          <li class="nav-item">
          <a
            class="nav-link"
            data-toggle="tab"
            href="#clone"
            role="tab"
            aria-controls="profile"
            aria-selected="false"
          >Clone</a>
        </li>

      </ul>
      <div
        class="tab-content"
        id="tab-content"
      >

        <div
          class="tab-pane show active"
          id="simple"
          role="tabpanel"
          aria-labelledby="profile-tab"
        >
          <simple />

        </div>

         <div
          class="tab-pane show"
          id="twoLists"
          role="tabpanel"
          aria-labelledby="profile-tab"
        >
          <twoLists />

        </div>

        <div
          class="tab-pane show"
          id="clone"
          role="tabpanel"
          aria-labelledby="profile-tab"
        >
          <clone />

        </div>


      </div>
    </div>
  </div>
</template>

<script>
import simple from "./components/simple";
import twoLists from "./components/two-lists";
import clone from "./components/clone";

export default {
  name: "app",
  components: {
    simple,
    twoLists,
    clone
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
