'use strict';
var 
	path = require('path')
,	gutil = require('gulp-util')
,	through = require('through2')
,	OSS	= require('oss-client')
,	mime    = require('mime')
	
const PLUGIN_NAME = 'gulp-oss-up'

module.exports = function (options) {
	options = options || {}
	if(!options.accessKeyId || !options.accessKeySecret || !options.bucket || !options.objectDir) {
		throw new gutil.PluginError('gulp-oss-up', 'accessKeyId, accessKeySecret, bucket and objectDir are all required!')
		return false
	}
	options.objectGen || options.objectGen = function(dest, src){
		return [dest, src].join('\/')
	}
	
	return through.obj(function (file, enc, callback) {
		if (file.isNull()) {
			callback(null, file);
			return;
		}

		if (file.isStream()) {
            return callback(new gutil.PluginError(PLUGIN_NAME, 'No stream support'));
        }
		var 
			option = {
				accessKeyId: options.accessKeyId,
				accessKeySecret: options.accessKeySecret
			}
		,	oss = new OSS.OssClient(option)
		,	obj = options.objectGen(options.objectDir, file.relative)	
		,	obj = object.replace(/\\/g, "/")
		,	mimetype = mime.lookup(obj)
		
		oss.headObject({
			bucket: options.bucket
		,   object: obj
		}, function(err, header) {
			if (err && err.code.toLowerCase() !== 'nosuchkey') {
				return callbackk(new gutil.PluginError(PLUGIN_NAME, "AliOss Error: " + err.message))
			}

			oss.putObject({
				bucket: options.bucket,
				srcFile:   file.contents,
				contentType: mimetype
			}, function(err, data) {
				if(err) {
					return callback(new gutil.PluginError(PLUGIN_NAME, "AliOss Error: " + err.message))
				}
				if(header) {
					if(header.ETag !== data.ETag) {
						gutil.log(gutil.colors.cyan("Updated..."), obj)
					} else {
						gutil.log(gutil.colors.gray("No Change..."), obj)
					}	
				} else {    
					// doesn't exist in bucket, it's new
					gutil.log(gutil.colors.cyan("Uploaded..."), obj)
				}
				callback(null, file)
			})
		})
	})
}