module.exports = {
  entry: "./index.js",
  mode: "development",
  output: {
    path: __dirname,
    filename: "./public/bundle.js"
  },
  devtool: "source-maps",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/react", "@babel/env"]
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};
//
