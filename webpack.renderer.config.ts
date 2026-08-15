import type { Configuration } from 'webpack';
import { DefinePlugin } from 'webpack';
import * as dotenv from 'dotenv';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import path from 'path';

const env = dotenv.config().parsed || {};

rules.push(
  {
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'postcss-loader' }],
  },
  {
    test: /\.(png|jpe?g|gif|svg)$/i,
    type: 'asset/resource',
  }
);

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins: [
    ...plugins,
    new DefinePlugin({
      __GOOGLE_MAPS_API_KEY__: JSON.stringify(env.VITE_GOOGLE_MAPS_API_KEY || ''),
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
      "@": path.resolve(__dirname, 'src'),
    },
  },
};