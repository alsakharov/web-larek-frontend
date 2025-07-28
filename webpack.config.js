const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require("dotenv-webpack");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProduction ? "production" : "development",
  entry: "./src/index.ts",  // <-- изменил на index.ts
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"], // чтобы импорт работал без расширений
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,  // обработка ts и tsx
        use: [
          "babel-loader",
          "ts-loader"
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "resolve-url-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sassOptions: {
                includePaths: ["src/scss"]
              },
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/pages/index.html",
    }),
    new MiniCssExtractPlugin(),
    new Dotenv(),
  ],
  devtool: isProduction ? false : "source-map",
  devServer: {
    static: path.resolve(__dirname, "dist"),
    compress: true,
    port: 3000,
    open: true,
    hot: true,
    client: {
      overlay: true,
    },
  },
};
