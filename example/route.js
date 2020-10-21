const ctx = require.context("./components/", false, /\.vue$/);

const routes = ctx.keys().map(key => ({
  path: key.substring(1).replace(".vue", "")
}));

routes.push({
  path: "/",
  redirect: "/simple"
});
export default routes;
