function getRouteFromDirectory(ctx) {
  return ctx.keys().map(key => ({
    path: key.substring(1).replace(".vue", ""),
    component: ctx(key).default,
  }));
}

const showAll = process.env.VUE_APP_SHOW_ALL_EXAMPLES === "true";
window.console.log(process.env.VUE_APP_SHOW_ALL_EXAMPLES);

const routes = [
  ...getRouteFromDirectory(require.context("./components/", false, /\.vue$/)),
  ...(!showAll
    ? []
    : getRouteFromDirectory(
        require.context("./debug-components/", false, /\.vue$/)
      )),
  {
    path: "/",
    redirect: "/simple",
  },
];

window.console.log(routes);


export default routes;
