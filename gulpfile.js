const deployFolder = 'dist';
const devFolder = 'src';

const path = {
	build: {
		html: `${deployFolder}/`,
		css: `${deployFolder}/css/`,
		js: `${deployFolder}/js/`,
		img: `${deployFolder}/img/`,
		fonts: `${deployFolder}/fonts/`,
		files: `${deployFolder}/files/`,
		video: `${deployFolder}/video/`,
	},
	src: {
		html: `${devFolder}/*.html`,
		css: `${devFolder}/scss/style.scss`,
		js: `${devFolder}/js/script.js`,
		img: `${devFolder}/img/**/*.{jpg,png,svg,gif,ico,webp}`,
		fonts: `${devFolder}/fonts/**/*.*`,
		files: `${devFolder}/files/*.*`,
		video: `${devFolder}/video/*.*`,
	},
	watch: {
		html: `${devFolder}/**/*.html`,
		css: `${devFolder}/scss/**/*.scss`,
		js: `${devFolder}/js/**/*.js`,
		img: `${devFolder}/img/**/*.{jpg,png,svg,gif,ico,webp}`,
		fonts: `${devFolder}/fonts/**/*.*`,
		files: `${devFolder}/files/*.*`,
		video: `${devFolder}/video/*.*`,
	},
	clean: `./${deployFolder}/`,
};

let {src, dest} = require('gulp'),
	gulp = require('gulp'),
	browsersync = require('browser-sync').create(),
	fileinclude = require('gulp-file-include'),
	del = require('del'),
	scss = require('gulp-sass')(require('sass')),
	autoprefixer = require('gulp-autoprefixer'),
	gcmq = require('gulp-group-css-media-queries'),
	cleanCss = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify-es').default,
	concat = require('gulp-concat'),
	babel = require('gulp-babel'),
	imagemin = require('gulp-imagemin'),
	svgsprite = require('gulp-svg-sprite'),
	cheerio = require('gulp-cheerio'),
	cache = require('gulp-cache');
sourcemaps = require('gulp-sourcemaps');

const browserSync = () => {
	browsersync.init({
		server: {
			baseDir: `./${deployFolder}/`,
		},
		port: 3000,
		notify: true,
	});
};

const html = () => {
	return src(path.src.html)
		.pipe(fileinclude())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream());
};

const css = () => {
	return src(path.src.css)
		.pipe(sourcemaps.init())
		.pipe(scss().on('error', scss.logError))
		.pipe(gcmq())
		.pipe(
			autoprefixer(['last 5 versions'], {
				cascade: true,
			})
		)
		.pipe(sourcemaps.write('./'))
		.pipe(dest(path.build.css))
		.pipe(cleanCss())
		.pipe(
			rename({
				extname: '.min.css',
			})
		)
		.pipe(sourcemaps.write('./'))
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream());
};

const js = () => {
	src([
		// js libs uncomment what you need

		// jQuery
		// "node_modules/jquery/dist/jquery.min.js",

		// svg support in all browsers
		'node_modules/svg4everybody/dist/svg4everybody.min.js', // no jQuery needed

		// modal
		// "node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js",

		// animation
		// "src/libs/gsap-and-scrollTrigger.js",
		// "src/libs/jarallax.min.js"

		// tooltips
		// "node_modules/@popperjs/core/dist/umd/popper.min.js",

		// counter
		// "node_modules/jquery-nice-select/js/jquery.nice-select.min.js",

		// swiper slider
		// "node_modules/swiper/swiper-bundle.min.js",
	])
		.pipe(sourcemaps.init())
		.pipe(concat('libs.min.js'))
		.pipe(sourcemaps.write('./'))
		.pipe(dest(path.build.js));

	return src(path.src.js)
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: ['@babel/env'],
			})
		)
		.pipe(dest(path.build.js))
		.pipe(uglify())
		.pipe(
			rename({
				extname: '.min.js',
			})
		)
		.pipe(sourcemaps.write('./'))
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream());
};

const img = () => {
	return src(path.src.img)
		.pipe(
			cache(
				imagemin({
					interlaced: true,
				})
			)
		)
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [
					{
						removeViewBox: false,
					},
				],
				interlaced: true,
				optimizationLevel: 3,
			})
		)
		.pipe(
			cache(
				imagemin({
					interlaced: true,
				})
			)
		)
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream());
};

const svgSprite = () => {
	return src(`${devFolder}/img/sprite-svg/*.svg`) // svg files for sprite
		.pipe(
			svgsprite({
				mode: {
					stack: {
						sprite: '../sprite.svg', //sprite file name
					},
				},
			})
		)
		.pipe(
			cheerio({
				run: function ($) {
					$('[fill]').removeAttr('fill');
					$('[stroke]').removeAttr('stroke');
					$('[style]').removeAttr('style');
					$('[class]').removeAttr('class');
					$('[width]').removeAttr('width');
					$('[height]').removeAttr('height');
					$('style').remove();
				},
				parserOptions: {
					xmlMode: true,
				},
			})
		)
		.pipe(gulp.dest(`${deployFolder}/img/sprite-svg/`));
};

const fonts = () => {
	src(path.src.fonts).pipe(dest(path.build.fonts));
	return src(path.src.fonts).pipe(dest(path.build.fonts));
};

const files = () => {
	src(path.src.files).pipe(dest(path.build.files));
	return src(path.src.files).pipe(dest(path.build.files));
};

const video = () => {
	src(path.src.video).pipe(dest(path.build.video));
	return src(path.src.video).pipe(dest(path.build.video));
};

const clearCache = () => {
	return cache.clearAll();
};

const clean = () => {
	return del(path.clean);
};

const watchFiles = () => {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], img);
	gulp.watch([path.watch.fonts], fonts);
	gulp.watch([path.watch.files], files);
	gulp.watch([path.watch.video], video);

	// TODO: check all files are watched
};

const build = gulp.series(
	clean,
	gulp.parallel(html, css, js, img, svgSprite, fonts, files, video)
);
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.html = html;
exports.css = css;
exports.js = js;
exports.img = img;
exports.svgSprite = svgSprite;
exports.fonts = fonts;
exports.files = files;
exports.video = video;
exports.build = build;
exports.watch = watch;
exports.default = watch;
