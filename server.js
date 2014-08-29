var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)
var twitter = require('twitter')
var tweetData;

//Configuring the server
app.set("ipaddr", "127.0.0.1")
app.set('port', '5000')


//Specify where public content is
app.use(express.static("public", __dirname + "/public"))

// Welcome message
server.listen(app.get("port"))
console.log("Node server running at http://localhost:5000")

//Routes
app.get('/', function(req, resp) {
  resp.sendfile(__dirname + '/index.html')
});

//Setting up Twitter Stream

var twitter = new twitter({
    consumer_key: 'g7GlNrCh8ZqKK6ZI2fcd4u5yh',
    consumer_secret: '5UJQcLu6yoBwD5691AHnfn3krawz7IW1OMtGLLvQIuIoeoz03o',
    access_token_key: '2496754267-moP414W7YH2Nbgqjk8Cj0cSRaWn6H4ayTZlJXak',
    access_token_secret: 'ltxRV2brjC00UfelkvNbZDDUjxwq9Av7cruQgfdzLP9sl'
});

twitter.stream('filter', { 'locations': '-180,-90,180,90' }, function(stream) {
  stream.on('data', function(data) {
    if (data.id =! null) {
      if (tweetData == null) {
        tweetData = data;
      } else {
        io.sockets.emit('new message', tweetData);
        tweetData = null;
        }
    };
  });
})