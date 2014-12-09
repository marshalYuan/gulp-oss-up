var
	should = require('should')
,	oss_up = require('./')
,	config = require('./testConfig')
,	gutil = require('gulp-util')
,	es = require('event-stream')

describe('gulp-oss-up',function(){
	it('should return 200',  function(done){
		var 
			testString = "gulp-oss-up-test :" + new Date()
		,	file = new gutil.File({
				path: "./test.txt",
				contents: new Buffer(testString, 'utf8')
			})
		,	my_oss_up = oss_up(config)

		my_oss_up.once('data', function(result) {
	        // make sure it came out the same way it went in
	        result.isBuffer().should.be.true;

	        result._status.should.eql(200)
	        done()
      	})
      	my_oss_up.write(file)
      	my_oss_up.end()
	})
})

