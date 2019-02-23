<template>
  <div id="app">
    <div class="logo">
      <img alt="Vue logo" src="./assets/logo.png" />
    </div>

    <div class="container ">
      <ul class="nav nav-tabs" role="tablist">
        <li
          class="nav-item"
          v-for="component in componentList"
          :key="component.name"
        >
          <a
            class="nav-link"
            data-toggle="tab"
            :data-route="`/${component.name}`"
            :href="`#${component.name}`"
            role="tab"
            aria-controls="profile"
            >{{ component.display }}</a
          >
        </li>
      </ul>

      <div class="tab-content" id="tab-content">
        <div
          class="tab-pane show"
          :id="component.name"
          role="tabpanel"
          aria-labelledby="profile-tab"
          v-for="component in componentList"
          :key="component.name"
        >
          <component :is="component.name"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

const requireContext = require.context("./components/", false, /\.vue$/);

const components = requireContext.keys().reduce((acc, key) => {
  const name = key.replace(/^\.\//, "").replace(/\.\w+$/, "");
  const component = requireContext(key).default;
  acc[name] = component;
  return acc;
}, {});

window.console.log(components);

const componentsToDisplay = [
  "simple",
  "two-lists",
  "clone",
  "custom-clone",
  "handle",
  "transition-example",
  "transition-example-2",
  "nested-example",
  "footerslot",
  "headerslot"
];

export default {
  name: "app",
  components,
  data() {
    const componentList = componentsToDisplay.map(name => ({
      name,
      display: components[name].display || name
    }));
    return {
      componentList
    };
  },
  created() {
    this.$router.afterEach(to => {
      this.toRoute(to);
    });
  },
  mounted() {
    this.toRoute(this.$route);
    $('a[data-toggle="tab"]').on("shown.bs.tab", e => {
      this.$router.push({ path: e.target.dataset.route });
    });
  },
  methods: {
    toRoute(route) {
      $(`a[data-route="${route.path}"]`).tab("show");
    }
  }
};
</script>

<style scoped="true">
.main-application {
  width: 400px;
}

.logo {
  text-align: center;
}

>>> h3 {
  font-size: 1.4em;
}
</style>
