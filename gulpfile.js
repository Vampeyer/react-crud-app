'use strict';

const gulp = require('gulp');
const webpack = require('webpack-stream');
const gulpLoadPlugins = require('gulp-load-plugins');
const plugins = gulpLoadPlugins();

gulp.task('webpack:dev', () => {
  return gulp.src(__dirname + '/app/js/client.js', { read: true })
    .pipe(webpack({
      context: __dirname + "/app",
      entry: "./js/client.js",
      output: {
        filename: "bundle.min.js",
        path: __dirname + "/build/js",
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel",
            query: {
              presets: ['react']
            }
          }
        ]
      }
    }))
    .pipe(plugins.concat('bundle.min.js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest('build/js'));
});
gulp.task('html:dev', () => {
  return gulp.src(__dirname + '/app/**/*.html')
    .pipe(plugins.htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(__dirname + '/build'));
});
gulp.task('css:dev', () => {
  return gulp.src(__dirname + '/app/css/**/*.css')
    .pipe(plugins.cssnano())
    .pipe(gulp.dest(__dirname + '/build/css'));
});
gulp.task('build:dev', [
  'webpack:dev',
  'html:dev',
  'css:dev'
]);
gulp.task('default', ['build:dev']);

gulp.task('webpack:test', () => {
  return gulp.src(__dirname + '/test/testEntry.js', { read: true })
    .pipe(webpack({
      output: {
        filename: 'testBundle.js'
      }
    }))
    .pipe(gulp.dest('test'));
});
