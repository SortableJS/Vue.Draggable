function getRouteFromDirectory(ctx) {
  return ctx.keys().map(key => ({
    path: key.substring(1).replace(".vue", ""),
    component: ctx(key).default
  }));
}

const showDebug = process.env.VUE_APP_SHOW_ALL_EXAMPLES === "true";
window.console.log(showDebug, process.env.VUE_APP_FILTER_ROUTE);

function getRouteFilterFromConfiguration(configuration) {
  const routeFromConfiguration = configuration
    .split(",")
    .filter(value => value !== "");
  if (routeFromConfiguration.length === 0) {
    return () => true;
  }

  window.console.log(
    `Using route filter VUE_APP_FILTER_ROUTE: "${configuration}"`
  );
  return name => routeFromConfiguration.includes(name);
}

const filterRoute = getRouteFilterFromConfiguration(
  process.env.VUE_APP_FILTER_ROUTE
);

const routes = [
  ...getRouteFromDirectory(require.context("./components/", false, /\.vue$/)),
  ...(!showDebug
    ? []
    : getRouteFromDirectory(
        require.context("./debug-components/", false, /\.vue$/)
      ))
];
routes.forEach(
  route => (route.component.show = filterRoute(route.component.display))
);

const filteredRoutes = routes.filter(route => route.component.show);

if (filteredRoutes.length === 0) {
  throw new Error(
    `No routes to match "${
      process.env.VUE_APP_FILTER_ROUTE
    }". Available route: ${routes
      .map(route => `"${route.component.display}"`)
      .join(", ")} .Please check env variable: VUE_APP_FILTER_ROUTE`
  );
}

const redirect = filteredRoutes.some(r => r.path === "/simple")
  ? "/simple"
  : filteredRoutes[0].path;

const allRoutes = [
  ...filteredRoutes,
  { path: "/", redirect },
  { path: "/:pathMatch(.*)*", redirect }
];

export default allRoutes;
