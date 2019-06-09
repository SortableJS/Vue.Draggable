module.exports = {
  input: "src/vuedraggable.js",
  output: {
    moduleName: "vuedraggable",
    format: ["es", "cjs", "umd", "umd-min"]
  },
  babel: {
    minimal: true
  },
  plugins: {
    babel: {
      runtimeHelpers: true,
      configFile: false
    }
  }
};
