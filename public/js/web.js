
var overlay;
var M;
var Tweets = 0;
var HashtagObject = {};


window.onload = function() {
  var serverBaseUrl = document.domain;
  var socket = io.connect(serverBaseUrl);
  var map = document.getElementById('map');
  var options = {
    center: new google.maps.LatLng(50,10),
    zoom: 2,
    panControl: false,
    zoomControl: false,
    scaleControl: false,
    mapTypeControl: false,
    rotateControl: false,
    overviewMapControl: false,
    styles: [
    {
      "stylers": [
      { "saturation": -100 },
      { "gamma": 0.15 },
      { "weight": 1.1 },
      { "lightness": -35 },
      { "visibility": "simplified" }
      ]
    }
    ]
  }

  M = new google.maps.Map(map, options);

  socket.on('connection', function () {
    console.log('Connected');
  });

  socket.on('new message', displayAlgorithm)
    console.log("new message")
  }

//This will display the tweets ******


function displayAlgorithm(data) {
  //This conditional ensures that we only look at tweets with Hashtags and locations
  if (data.entities.hashtags[0] != null & data.geo != null) {
    //Keep and display a global counter for # of tweets
    Tweets++;
    var tweetP = document.querySelector("#tweetCount")
    var trending = document.querySelector("#trending")
    tweetP.innerHTML = "Tweets: " + Tweets

    //Creates my object of hashtags
    if (HashtagObject.hasOwnProperty(data.entities.hashtags[0].text)) {
        HashtagObject[data.entities.hashtags[0].text] += 1
    }
    else {
      HashtagObject[data.entities.hashtags[0].text] = 1
    }
    console.log(HashtagObject)

    var sortable = [];
    var sorted = [];
    for (var thing in HashtagObject) {
      sortable.push([thing, HashtagObject[thing]])
      sortable.sort(function(a, b) {return b[1] - a[1]})
    }
    var topTen = sortable.slice(0,10);
    console.log(topTen)
    for (var i=0; i<topTen.length; i++) {
      sorted.push(topTen[i][0]);
    }
    for (var i=0; i<sorted.length; i++) {
      if ($('#trending').children().length < 10) {
        var newLI = document.createElement("li");
        trending.appendChild(newLI);
        newLI.innerHTML = sorted[i];
      }
      else {
        var newLI = document.createElement("li");
        $('#trending')[0].children[i].innerHTML = sorted[i];
      }
    }



    //Establishing the bounds for the overlay
    var swBound = new google.maps.LatLng(data.geo.coordinates[0], data.geo.coordinates[1]);
    var neBound = new google.maps.LatLng(data.geo.coordinates[0] + .00001, data.geo.coordinates[1] +.00001);
    var bounds = new google.maps.LatLngBounds(swBound, neBound);
    var hashtag = data.entities.hashtags[0].text
    overlay = new tweetMarker(bounds, hashtag, M);
  }
}

//Constructor Function for overlay
    function tweetMarker(bounds, text, map) {
      this.bounds_ = bounds;
      this.text_ = text;
      this.map_ = map;
      this.div_ = null;
      this.setMap(map)
    }

    tweetMarker.prototype = new google.maps.OverlayView();


    tweetMarker.prototype.onAdd = function() {

      var div = document.createElement('div');
      div.style.borderStyle = 'none';
      div.style.borderWidth = '0px';
      div.style.position = 'absolute';
      var p = document.createElement('p');
      var textM = document.createTextNode(this.text_);
      p.appendChild(textM);
      p.style.width = '100%';
      p.style.height = '100%';
      p.style.position = 'absolute';
      div.appendChild(p);
      this.div_ = div;
      var panes = this.getPanes();
      panes.overlayLayer.appendChild(div);
    };




    tweetMarker.prototype.draw = function() {
      var overlayProjection = this.getProjection();
      var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
      var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
      var div = this.div_;
      div.style.left = sw.x + 'px';
      div.style.top = ne.y + 'px';
      div.style.width = (ne.x - sw.x) + 'px';
      div.style.height = (sw.y - ne.y) + 'px';
      setTimeout(function() {
        $(div).remove();
      }, 1500);
};

// The onRemove() method will be called automatically from the API if
// we ever set the overlay's map property to 'null'.
    // tweetMarker.prototype.onRemove = function() {
    //   this.div_.parentNode.removeChild(this.div_);
    //   this.div_ = null;
    // };








