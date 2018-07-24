const rewireStyledComponents = require('react-app-rewire-styled-components');

/* config-overrides.js */
console.log('what');
module.exports = function override(config, env) {
  config = rewireStyledComponents(config, env, { minify: false });
  return config;
};
