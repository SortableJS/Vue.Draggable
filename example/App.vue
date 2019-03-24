<template>
  <div id="app">
    <a href="https://github.com/SortableJS/Vue.Draggable" target="_blank">
      <img
        style="position: fixed; top: 0; right: 0; border: 0; z-index:99999"
        width="149"
        height="149"
        src="https://github.blog/wp-content/uploads/2008/12/forkme_right_gray_6d6d6d.png?resize=149%2C149"
        class="attachment-full size-full"
        alt="Fork me on GitHub"
        data-recalc-dims="1"
      />
    </a>

    <div class="container ">
      <div class="jumbotron logo">
        <img
          class="draggable"
          alt="Vue.draggable logo"
          src="./assets/logo.svg"
        />

        <div id="badges">
          <a
            target="_blank"
            href="https://circleci.com/gh/SortableJS/Vue.Draggable"
            ><img
              src="https://circleci.com/gh/SortableJS/Vue.Draggable.svg?style=shield"
            />
          </a>
          <a
            target="_blank"
            href="https://codecov.io/gh/SortableJS/Vue.Draggable"
            ><img
              src="https://codecov.io/gh/SortableJS/Vue.Draggable/branch/master/graph/badge.svg"
            />
          </a>
          <a
            target="_blank"
            href="https://codebeat.co/projects/github-com-sortablejs-vue-draggable-master"
            ><img
              src="https://codebeat.co/badges/7a6c27c8-2d0b-47b9-af55-c2eea966e713"
            />
          </a>
          <a
            target="_blank"
            href="https://github.com/SortableJS/Vue.Draggable/issues?q=is%3Aopen+is%3Aissue"
            ><img
              src="https://img.shields.io/github/issues/SortableJS/Vue.Draggable.svg"
            />
          </a>
          <a target="_blank" href="https://www.npmjs.com/package/vuedraggable"
            ><img src="https://img.shields.io/npm/dt/vuedraggable.svg" />
          </a>
          <a target="_blank" href="https://www.npmjs.com/package/vuedraggable"
            ><img src="https://img.shields.io/npm/dm/vuedraggable.svg" />
          </a>
          <a target="_blank" href="https://www.npmjs.com/package/vuedraggable"
            ><img src="https://img.shields.io/npm/v/vuedraggable.svg" />
          </a>
          <a
            target="_blank"
            href="https://github.com/SortableJS/Vue.Draggable/blob/master/LICENSE"
            ><img
              src="https://img.shields.io/github/license/SortableJS/Vue.Draggable.svg"
            />
          </a>
        </div>
      </div>

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
          <div class=" justify-content-center jumbotron">
            <div class="row  icon">
              <a
                class="col-2 icon"
                target="_blank"
                :href="
                  `https://github.com/SortableJS/Vue.Draggable/blob/master/example/components/${
                    component.name
                  }.vue`
                "
              >
                <i class="fa fa-github icon-large"></i>
              </a>
            </div>

            <component :is="component.name"></component>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

const requireContext = require.context("./components/", false, /\.vue$/);

const components = requireContext.keys().reduce((acc, key) => {
  const component = requireContext(key).default;
  acc[component.name] = component;
  return acc;
}, {});

export default {
  name: "app",
  components,
  data() {
    const componentList = Object.keys(components)
      .map(key => components[key])
      .sort((a, b) => a.order - b.order);
    return {
      componentList
    };
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
  },
  watch: {
    $route: function(route) {
      this.toRoute(route);
    }
  }
};
</script>

<style scoped="true">
.main-application {
  width: 400px;
}

.jumbotron.logo {
  text-align: center;
  padding-top: 32px;
  padding-bottom: 16px;
}

.jumbotron.logo .draggable {
  height: 200px;
}

>>> h3 {
  font-size: 1.4em;
}

.icon i {
  font-size: 24px;
}

a {
  color: black;
}

#badges {
  text-align: center;
  padding: 10px;
}

#badges img {
  padding-left: 2px;
  padding-right: 2px;
}

#tab-content {
  min-height: 500px;
}
</style>
