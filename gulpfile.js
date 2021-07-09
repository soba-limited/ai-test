var gulp = require("gulp");
var isChanged = require("gulp-changed");
var minifyImg = require("gulp-imagemin");
var minifyImg_JPG = require("imagemin-jpeg-recompress");
var minifyImg_PNG = require("imagemin-pngquant");
var minifyImg_GIF = require("imagemin-gifsicle");
var svgmin = require("gulp-svgmin");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("gulp-autoprefixer");
var gcmq = require("gulp-group-css-media-queries");
var csscomb = require("gulp-csscomb"); //cssプロパティ順序
var notify = require("gulp-notify");
var rename = require("gulp-rename");
var cleanCSS = require("gulp-clean-css");
var plumber = require("gulp-plumber");
var sassGlob = require("gulp-sass-glob");
var sourcemaps = require("gulp-sourcemaps");
sass.compiler = require("sass");
var pug = require("gulp-pug");

var FtpDeploy = require("ftp-deploy");
var ftpDeploy = new FtpDeploy();

gulp.task("minify-img", function (done) {
  gulp
    .src("src/**/*.+(jpg|jpeg|png|gif)") //src部分は適宜環境に合わせて修正
    .pipe(isChanged("assets/images"))
    .pipe(minifyImg([minifyImg_JPG(), minifyImg_PNG(), minifyImg_GIF()]))
    .pipe(gulp.dest("assets/images"));
  done();
});

gulp.task("svgmin", function (done) {
  gulp
    .src("src/**/*.+(svg)")
    .pipe(isChanged("assets/images"))
    .pipe(svgmin())
    .pipe(gulp.dest("assets/images"));
  done();
});

// Sass compile task
gulp.task("scss", function (done) {
  return gulp
    .src("./assets/css/**/*.scss") // コンパイル対象 scss
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(
      sass({
        fibers: "fibers",
      })
    )
    .pipe(
      plumber({
        errorHandler: notify.onError("Error: &lt;%= error.message %&gt;"),
      })
    )
    .pipe(csscomb())
    .pipe(
      autoprefixer({
        // ☆IEは11以上、Androidは4.4以上
        // その他は最新2バージョンで必要なベンダープレフィックスを付与する設定
        overrideBrowserslist: ["last 2 versions", "ie >= 11", "Android >= 6"],
        grid: "autoplace",
      })
    )
    .pipe(gcmq())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./assets/css")); // 出力
  done();
});

// .min.css generate task
gulp.task("mincss", function (done) {
  return gulp
    .src(["./assets/css/**/*.css", "!./assets/css/**/*.min.css"]) //上のタスクで生成した css
    .pipe(cleanCSS()) // css 圧縮
    .pipe(
      rename({
        extname: ".min.css",
      })
    ) // .min.css にリネーム
    .pipe(gulp.dest("./assets/css")) // min.css 出力
    .pipe(
      notify({
        title: "compiled!",
        message: new Date(),
        sound: "Pop",
      })
    );
  done();
});

//pug

var pugOptions = {
  pretty: true,
};

gulp.task("pug", () => {
  return gulp
    .src(["./pug/**/*.pug", "!./pug/**/_*.pug", "!./pug/**/template.pug"])
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(pug(pugOptions))
    .pipe(gulp.dest("./"));
});

// ftp-deploy
gulp.task("ftp", (done) => {
  var config = {
    user: "xs452977",
    password: "kw3eqep2",
    host: "sv12383.xserver.jp",
    port: 21,
    localRoot: process.cwd(),
    remoteRoot: "/xs452977.xsrv.jp/public_html/atem/wp-content/themes/yma/",
    include: ["*.html", "*.php", "*.css", "*.ico", "assets/**/*", "temp/**/*"],
    exclude: [
      "src/**/*",
      "node_modules/**/*",
      ".prettierrc",
      "gulpfile.js",
      "*.lock",
      "*.json",
      "**/*.pug",
    ],
    deleteRemote: false,
    forcePasv: true,
  };
  ftpDeploy.on("uploaded", (data) => {
    console.log("Uploaded", data);
  });
  ftpDeploy.deploy(config, function (err) {
    if (err) console.log(err);
    else console.log("ftp deploy finished");
  });
  done();
});

gulp.task("default", function (done) {
  // scss watch & ftp deploy
  gulp.watch("./assets/css/**/*.scss", gulp.series("scss", "mincss"));
  gulp.watch(
    ["./pug/**/*.pug", "!./pug/**/_*.pug", "!./pug/**/template.pug"],
    gulp.series("pug")
  );
  gulp.watch(["src/**/*.*"], gulp.series("minify-img", "svgmin")); //src部分は適宜環境に合わせて修正
  done();
});
