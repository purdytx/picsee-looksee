/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
	, picsee = require('picsee');

// Picsee options
var root = __dirname + '/public/';
// For the sake of demo, keeping "staging" local to app, 
// but PLEASE change this for your app for security reasons.
var staging = root + 'images/staging/';
var processing = 'images/processing/';
var uploaded = 'images/uploaded/';

var options = {
	docRoot: root,
	urlRoot: 'http://localhost:3000/',
	stagingDir: staging,
	processDir: processing,
	uploadDir: uploaded,
	versions: [  
		{ "thmb": { w: 32, h: 32 } },   
		{ "profile": { w: 200, h: null } },  
		{ "full": { w: null, h: null } }  
	],
	separator: '_',  
	directories: 'single',
	namingConvention: 'date',
	inputFields: ['profPhoto', 'other']
}

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
	/**
	 * Init picsee
	 */
	picsee.initialize(options);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function (req, res, next) {
  res.render('index', { title: 'Express', results: false });
});

app.post('/upload', function (req, res, next) { 
	picsee.upload(req, res, function (err, results) { 
		console.log('err from upload', err);
		console.log('results from upload', results);
		if (err) res.send(err);
		res.render('crop', { title: 'Save or Crop You Photos', results: results || false });
	})
});

app.post('/crop', function (req, res, next) {
	picsee.crop(req, res, function (err, result) {
		res.render('success', { title: 'Success!', result: result || false });
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
