L.mapbox.accessToken = 'pk.eyJ1IjoiYnV6emxpZ2h0eWVhcjE4MiIsImEiOiJtQ1FQWXZNIn0.3Mbs1_mAeGXybLb5OPhsCg';
    var map = L.mapbox.map('map', 'buzzlightyear182.j547ep00')
        .setView([41.398, 2.174], 3);

    // var markers = new L.MarkerClusterGroup();
    var markers = new L.mapbox.featureLayer();

    $.get('http://localhost:3000/bad_points', function(data){
      for(var i=0; i<data.length; i++){
        var latitude = parseFloat(data[i].coordinates.split(',')[0]);
        var longitude = parseFloat(data[i].coordinates.split(',')[1]);
        var title = data[i].text;
        var screen_name = data[i].screen_name;
        var profile_pic = data[i].profile_pic
        var marker = L.marker(new L.LatLng(latitude, longitude), {

            title: title
        });
         marker.setIcon(L.mapbox.marker.icon({
                    'marker-color': '#ff1111',
                    'marker-size': 'large'
                }));
        marker.bindPopup(title);
        markers.addLayer(marker);
      }

      map.addLayer(markers);
    });

    $.get('http://localhost:3000/good_points', function(data){
      for(var i=0; i<data.length; i++){
        var latitude = parseFloat(data[i].coordinates.split(',')[0]);
        var longitude = parseFloat(data[i].coordinates.split(',')[1]);
        var title = data[i].text;
        var favourite_count = data[i].favourite_count;
        var screen_name = data[i].screen_name;
        var profile_pic = data[i].profile_pic
        var marker = L.marker(new L.LatLng(latitude, longitude), {
            title: title
        });
         marker.setIcon(L.mapbox.marker.icon({
                    'marker-color': '#11ff11',
                    'marker-size': 'large'
                }));
        map.legendControl.addLegend('<div><div class="upvote"><a href="#" class="upvote-link"></a><span class="vote-count">'+favourite_count+'</span></div><div class="screen_name">'+ screen_name +'</div><img id="tweet_img" src="'+ profile_pic +'" /><div class="tweet">'+title+'</div></div>');
       
        
        marker.bindPopup(title);
        markers.addLayer(marker);
        var screen_name_div = document.getElementsByClassName("screen_name");
        for (var i = 0; i < screen_name_div.length; i++) {
            screen_name_div[i].addEventListener("click", myfuction, false); 
        }
        function myfuction(){
           marker.bindPopup(title).openPopup();
        }
      }

      map.addLayer(markers);
    });

    


