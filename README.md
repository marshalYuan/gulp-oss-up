gulp-oss-up
===========

A gulp pluginl for uploading static file to aliyun oss.

##install
`npm install gulp-oss-up --save-dev`

##usage
```
var gulp = require('gulp');
var up = require('gulp-oss-up');
gulp.task('test', function() {
	return gulp.src("./app.js")
		.pipe(up({
			"accessKeyId": "your accessKeyId",
			"accessKeySecret": "your accessKeySecret", 
			"bucket": "bucket", //your bucket name
			"objectDir": "dir" //your targer directory in the bucket(optional)
		}));
});
```
This config will upload your current directory file `index.html` to `dir/index.html` in your bucket.
##optional param

###objectDir
`default: ""; //root directory`
###objectGen
default
```
function(dest, src){
	return [dest, src].join('\/')
}
```
`dest` is `obejctDir`; `src` is the file path relative to cwd path
##test
`touch testConfig.json`
edit your testConfig file
`mocha test.js`

