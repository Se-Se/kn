const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const { override, addWebpackPlugin } = require('customize-cra');

// module.exports = {
//   webpack: (config, instances) => {
//     config.plugins.push(new MonacoWebpackPlugin({
//       // 所需语言支持
//       languages: ["javascript", "typescript"],
//       // targetName 业务名
//       filename: `${targetName}-[name].[contenthash:10].js`,
//     }));
//     return config;
//   },
// };

module.exports = override(
    addWebpackPlugin(
        new MonacoWebpackPlugin({
            languages: ['python','shell']
        })
    )
)