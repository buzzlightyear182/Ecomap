L.mapbox.accessToken = 'pk.eyJ1IjoiYnV6emxpZ2h0eWVhcjE4MiIsImEiOiJtQ1FQWXZNIn0.3Mbs1_mAeGXybLb5OPhsCg';
    var map = L.mapbox.map('map', 'buzzlightyear182.j547ep00')
        .setView([41.398, 2.174], 3);

    // var markers = new L.MarkerClusterGroup();
    var markers = new L.mapbox.featureLayer();

    $.get('http://localhost:3000/bad_points', function(data){
      appendMarkers(data, 'red');
    });

    $.get('http://localhost:3000/good_points', function(data){
      appendMarkers(data, 'green');
    });

    
var appendMarkers = function(geoPoints, typeOfPoint){
  for(var i=0; i<geoPoints.length; i++){
    var latitude = parseFloat(geoPoints[i].coordinates.split(',')[0]);
    var longitude = parseFloat(geoPoints[i].coordinates.split(',')[1]);
    var title = geoPoints[i].text;
    var marker = L.marker(new L.LatLng(latitude, longitude), {
        title: title
    });
    if(typeOfPoint == 'red'){
      marker.setIcon(L.mapbox.marker.icon({
        'marker-color': '#ff1111',
        'marker-size': 'large'
      }));
    }
    else if(typeOfPoint == 'green'){
      var favourite_count = geoPoints[i].favourite_count;
      var screen_name = geoPoints[i].screen_name;
      var profile_pic = geoPoints[i].profile_pic
      marker.setIcon(L.mapbox.marker.icon({
        'marker-color': '#11ff11',
        'marker-size': 'large'
      }));
      map.legendControl.addLegend('<div><div class="upvote"><a href="#" class="upvote-link"></a><span class="vote-count">'+favourite_count+'</span></div><div class="screen_name">'+ screen_name +'</div><img id="tweet_img" src="'+ profile_pic +'" /><div class="tweet">'+title+'</div></div>');
      var screen_name_div = document.getElementsByClassName("screen_name");
      for (var i = 0; i < screen_name_div.length; i++) {
          screen_name_div[i].addEventListener("click", function(){
            marker.bindPopup(title).openPopup();
          }, false); 
      }
    }
    marker.bindPopup(title);
    markers.addLayer(marker);
  }
  map.addLayer(markers);
}
