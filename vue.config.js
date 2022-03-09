const config = {
  publicPath: "./",
  configureWebpack: { 
    output: {
      libraryExport: 'default'
    }
  }
}

if (process.env.NODE_ENV === "production") {
  config.configureWebpack.externals = {
    sortablejs: {
      commonjs: "sortablejs",
      commonjs2: "sortablejs",
      amd: "sortablejs",
      root: "Sortable"
    },
    'better-sortable': {
      commonjs: "better-sortable",
      commonjs2: "better-sortable",
      amd: "better-sortable",
      root: "better-sortable"
    },
  };
};

module.exports = config;