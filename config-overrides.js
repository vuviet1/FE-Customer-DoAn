// config-overrides.js
const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    '@views': path.resolve(__dirname, 'src/views'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    // Thêm các alias khác nếu cần
  })
);
