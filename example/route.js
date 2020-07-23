const ctx = require.context("./components/", false, /\.vue$/);

const routes = ctx.keys().map(key => ({
  path: key.replace("./", "/")
}));

routes.push({
  path: "/",
  redirect: "/simple"
});
export default routes;
