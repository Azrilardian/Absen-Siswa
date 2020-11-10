const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const terserPlugin = require("terser-webpack-plugin");
const uglifyJs = require("uglifyjs-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge(common, {
	mode: "production",
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: "/node_modules/",
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-env"],
						},
					},
				],
			},
		],
	},
	plugins: [new OptimizeCSSAssetsPlugin(), new CleanWebpackPlugin()],
	optimization: {
		minimize: true,
		minimizer: [new OptimizeCSSAssetsPlugin({ cssProcessorOptions: { map: { inline: false, annotation: true } } }), new terserPlugin(), new uglifyJs()],
	},
});
