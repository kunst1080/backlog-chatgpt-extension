const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  entry: {
    options: "./src/options.ts",
    main: "./src/main.tsx",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "./src/manifest.json",
          to: "manifest.json",
        },
        {
          from: "./src/style.css",
          to: "style.css",
        },
        {
          from: "./src/options.html",
          to: "options.html",
        },
      ],
    }),
  ],
};
