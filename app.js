/* 
 * Module dependencies
 */
var express = require('express')
	, stylus = require('stylus')
	, nib = require('nib')
	
var fs = require('fs');
var walk = require('walk');


var app = express();
var multer = require('multer');
var pictures = [];

var walker = walk.walk('public/uploads', {followLinks: false});
var startwalker = function(){
	walker.on('file', function(root, stat, next) {
		pictures.push(stat.name);
		next();
	});

	walker.on('end', function() {
	console.log(pictures);
	});
};

 

function compile(str, path) {
	return stylus(str)
	  .set('filename',path)
          .use(nib())
}
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
	{src:__dirname + '/public'
	, compile: compile
	}
))
app.use(multer({ dest: './public/uploads/',
	rename:function (fieldname, filename) {
		return filename+Date.now();
	},
 	onFileUploadStart: function (file) {
		console.log(file.originalname + ' is starting ...')
	},
	onFileUploadComplete: function(file) {
		startwalker();
		console.log(file.fieldname + ' uploaded to ' + file.path)
	}
	}));

app.use(express.static(__dirname+'/public'))
app.use(express.bodyParser({uploadDir:'./uploads'}));

app.get('/', function (req, res) {
	res.render('index',
	{title:'Home'}
	)
	console.log('finished compiling response');



})

app.get('/upload', function(req, res) {
	res.render('upload');
	})



app.get('/loadpics', function(req, res) {
	res.render('loadpic',
	{title:'Pictures of the wedding'}
	)
	console.log('image loading page complete')

})

app.get('/loadpics/1', function(req, res) { 
	res.contentType('application/json');
	res.json(pictures);
	res.end();

})

app.listen(3000, function() {console.log("app live"); startwalker();})