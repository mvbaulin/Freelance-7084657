const gulp = require('gulp');
const concat = require('gulp-concat');
const order = require('gulp-order');
const less = require('gulp-less');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cleancss = require('gulp-clean-css');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();

gulp.task('less', function() {
	return gulp.src('source/less/**/*.less')
	.pipe(plumber())
	.pipe(order([
		'viewports.less',
		'colors.less',
		'visually-hidden.less',
		'*.less',
		'fonts.less'
 ]))
	.pipe(concat('style.less'))
	.pipe(plumber())
	.pipe(less())
	.pipe(gulp.dest('source/css/'))
})

gulp.task('postcss', function() {
	let plugins = [
		autoprefixer()
	]
	return gulp.src('source/css/style.css')
	.pipe(plumber())
	.pipe(postcss(plugins))
	.pipe(gulp.dest('source/css'))
})

gulp.task('cleancss', function() {
	return gulp.src('source/css/*.css')
	.pipe(plumber())
	.pipe(rename({
		suffix: '.min'
	}))
	.pipe(cleancss({
		level: 2
	}))
	.pipe(gulp.dest('source/min-css'))
	.pipe(browserSync.stream())
})

gulp.task('babel', function() {
	return gulp.src('source/js/*.js')
	.pipe(plumber())
	.pipe(babel({
		'presets': [
			'@babel/preset-env',
			'minify'
		]
	}))
	.pipe(rename({
		suffix: '.min'
	}))
	.pipe(gulp.dest('source/min-js'))
})

gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'source/'
		},
		// proxy: '',
		notify: false
	})
	gulp.watch('source/*.html').on('change', browserSync.reload);
	gulp.watch('source/*.php').on('change', browserSync.reload);
	gulp.watch('source/js/*.js', gulp.series('babel')).on('change', browserSync.reload)
	gulp.watch('source/less/*.less', gulp.series('less', 'postcss', 'cleancss'))
})

gulp.task('default', gulp.series('less', 'postcss', 'cleancss', 'babel', 'browserSync'));