
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.helpers({
    title: 'ROCkS - A Read Only Contact System'    // default title
});

// Routes

app.get('/', routes.site.index);

app.get('/users', routes.users.list);
app.post('/users', routes.users.create);
app.get('/users/:id', routes.users.show);
app.post('/users/:id', routes.users.edit);
app.del('/users/:id', routes.users.del);

app.post('/users/:id/follow', routes.users.follow);
app.post('/users/:id/unfollow', routes.users.unfollow);

app.get('/individualstocks', routes.individualstocks.list);
//app.post('/individualstocks', routes.individualstocks.create);
app.post('/individualstocks', routes.individualstocks.import);
app.get('/individualstocks/:id', routes.individualstocks.show);
app.post('/individualstocks/:id', routes.individualstocks.edit);
app.del('/individualstocks/:id', routes.individualstocks.del);

app.get('/individuals', routes.individuals.list);
//app.post('/individuals', routes.individuals.create);
app.post('/individuals', routes.individuals.import);
app.get('/individuals/:id', routes.individuals.show);
app.post('/individuals/:id', routes.individuals.edit);
app.del('/individuals/:id', routes.individuals.del);
app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
