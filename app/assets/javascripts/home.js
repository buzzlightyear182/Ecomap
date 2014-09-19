L.mapbox.accessToken = 'pk.eyJ1IjoiYnV6emxpZ2h0eWVhcjE4MiIsImEiOiJtQ1FQWXZNIn0.3Mbs1_mAeGXybLb5OPhsCg';
    var map = L.mapbox.map('map', 'buzzlightyear182.j547ep00')
        .setView([41.398, 2.174], 3);

    var greenMarkers = [];
    var layer = new L.mapbox.featureLayer();

    $.get('http://localhost:3000/bad_points', function(data){
      appendMarkers(data, 'red');
    });

    $.get('http://localhost:3000/good_points', function(data){
      appendMarkers(data, 'green');
      appendLegend(data);
    });

    
var appendMarkers = function(geoPoints, typeOfPoint){
  for(var i=0; i<geoPoints.length; i++)(function(i){
    appendMarker(geoPoints, typeOfPoint, i);
  })(i);
}

var appendMarker = function(geoPoints, typeOfPoint, index){
  setTimeout(function(){
    var latitude = parseFloat(geoPoints[index].coordinates.split(',')[0]);
    var longitude = parseFloat(geoPoints[index].coordinates.split(',')[1]);
    var description = geoPoints[index].text;
    var marker = null;
    marker = L.marker(
      [latitude, longitude],
      {
        icon: L.divIcon({
          className: typeOfPoint+'-marker',
          iconSize: [20, 20]
        })
      }
    );
    if(typeOfPoint=='green') greenMarkers.push(marker);
    marker.bindPopup(description);
    layer.addLayer(marker)
    map.addLayer(layer);
  }, 450*index + Math.floor(Math.random()*450))
}

var appendLegend = function(geoPoints){
  for(var i=0; i<geoPoints.length; i++){
    var favourite_count = geoPoints[i].favourite_count;
    var screen_name = geoPoints[i].screen_name;
    var profile_pic = geoPoints[i].profile_pic
    var description = geoPoints[i].text;
    map.legendControl.addLegend('<div><div class="upvote"><a href="#" class="upvote-link"></a><span class="vote-count">'+favourite_count+'</span></div><div class="screen_name">'+ screen_name +'</div><img id="tweet_img" src="'+ profile_pic +'" /><div class="tweet">'+description+'</div></div>');
  }
  
  var screen_name_div = document.getElementsByClassName("screen_name");
  for(var i=0; i<screen_name_div.length; i++)(function(i, marker){
    screen_name_div[i].addEventListener('click', function(){
      greenMarkers[i].openPopup();
    });
  })(i);
}