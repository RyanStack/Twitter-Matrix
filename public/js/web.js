
var overlay;
var M;


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
    // if (data.entities.hashtags[0] != null) {
    //   console.log(data)
    // }

  }

//This will display the tweets ******


function displayAlgorithm(data) {
  // debugger

  // function wordObj (data) {
  //   this.hash = data.entities.hashtags[0]
  //   this.location = data.geo.coordinates
  // }
  if (data.entities.hashtags[0] != null & data.geo != null) {
    // console.log("in algo")
    // debugger

    //Don't yet know why this doesn't have scope up top.


    //Establishing the bounds for the overlay
    var swBound = new google.maps.LatLng(data.geo.coordinates[0], data.geo.coordinates[1]);
    var neBound = new google.maps.LatLng(data.geo.coordinates[0] + .00001, data.geo.coordinates[1] +.00001);
    var bounds = new google.maps.LatLngBounds(swBound, neBound);

    overlay = new tweetMarker(bounds, data.entities.hashtags[0].text, M);

    // $(document.querySelector(overlay.div_)).remove();
  }
}

//Constructor Function for overlay
    function tweetMarker(bounds, text, map) {
      this.bounds_ = bounds;
      this.text_ = text;
      this.map_ = map;
      this.div_ = null;
      // console.log(map)
      this.setMap(map)

      //Legacy configuration ***
      // this.setMap(map);
      // this.word = word;
      // this.loc = loc;
      // this.dom = null;
    }

    tweetMarker.prototype = new google.maps.OverlayView();


    tweetMarker.prototype.onAdd = function() {

      var div = document.createElement('div');
      div.style.borderStyle = 'none';
      div.style.borderWidth = '0px';
      div.style.position = 'absolute';

  // Create the img element and attach it to the div.
      var p = document.createElement('p');
      var textM = document.createTextNode(this.text_);
      p.appendChild(textM);
      p.style.width = '100%';
      p.style.height = '100%';
      p.style.position = 'absolute';
      div.appendChild(p);

      this.div_ = div;
      // console.log(this.div_)


  // Add the element to the "overlayLayer" pane.
      var panes = this.getPanes();
      panes.overlayLayer.appendChild(div);
    };




    tweetMarker.prototype.draw = function() {
  // We use the south-west and north-east
  // coordinates of the overlay to peg it to the correct position and size.
  // To do this, we need to retrieve the projection from the overlay.
      var overlayProjection = this.getProjection();
  // Retrieve the south-west and north-east coordinates of this overlay
  // in LatLngs and convert them to pixel coordinates.
  // We'll use these coordinates to resize the div.
      var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
      var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
  // Resize the image's div to fit the indicated dimensions.
      var div = this.div_;
      div.style.left = sw.x + 'px';
      div.style.top = ne.y + 'px';
      div.style.width = (ne.x - sw.x) + 'px';
      div.style.height = (sw.y - ne.y) + 'px';
      setTimeout(function() {
        $(div).remove();
      // overlay.div_.parentNode.removeChild(overlay.div_)
      // console.log(overlay.div_.parentNode)
    }, 2000);
      // this.map_ = null;

};

// The onRemove() method will be called automatically from the API if
// we ever set the overlay's map property to 'null'.
    tweetMarker.prototype.onRemove = function() {
      this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
    };









//     tweetMarker.prototype.del = function() {
//       overlay.removeChild(this.dom);
//     }

//     tweetMarker.prototype.onAdd = function() {

//       var div = document.createElement('div');
//       div.style.borderStyle = 'none';
//       div.style.borderWidth = '0px';
//       div.style.position = 'absolute';

//   // Create the p element and attach it to the div.
//   var p = document.createElement('H1');
//   var t=document.createTextNode(this.word);
//   p.appendChild(t);
//   p.style.width = '100%';
//   p.style.height = '100%';
//   p.style.position = 'absolute';
//   div.appendChild(p);

//   this.dom = p

//   // Add the element to the "overlayLayer" pane.
//   var panes = this.getPanes();
//   panes.overlayLayer.appendChild(div);
// };
// }
// }

// function createDiv(c) {
//   var div = document.createElement('div');
//   div.className = c;
//   return div
// }