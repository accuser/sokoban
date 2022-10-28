// rollup.config.js
/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: "src/sokoban.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
    name: "Sokoban",
  },
};

module.exports = config;
