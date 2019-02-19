if (process.env.NODE_ENV === "production") {
  module.exports = {
    configureWebpack: {
      externals: {
        sortablejs: {
          commonjs: "sortablejs",
          commonjs2: "sortablejs",
          amd: "sortablejs",
          root: "Sortable"
        }
      }
    }
  };
}
