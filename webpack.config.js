const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        index: './src/pages/index.ts',
        list: './src/pages/list.ts'
    },
    devServer: {
        static: './dist',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            title: "Form - Yuji Hayashi - Genesis",
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            filename: "list.html",
            title: "List - Yuji Hayashi - Genesis",
            template: './public/index.html',
            chunks: ['list']
        }),
    ],
    module: {
        rules: [
            {
                test: /\.s(a|c)ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader:'sass-loader',
                        options: { 
                          sassOptions:{
                            includePaths: [path.resolve(__dirname, 'node_modules')]
                          }
                        }
                      }
                ]
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'scripts/[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
};