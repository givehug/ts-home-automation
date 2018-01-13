var merge = require('webpack-merge');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  HOST: '"yourDevHostName"',
  WS_HOST: '"yourDevWebSocketsHostName"'
});
