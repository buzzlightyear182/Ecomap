L.mapbox.accessToken = 'pk.eyJ1IjoiYnV6emxpZ2h0eWVhcjE4MiIsImEiOiJtQ1FQWXZNIn0.3Mbs1_mAeGXybLb5OPhsCg';
    var map = L.mapbox.map('map', 'buzzlightyear182.j547ep00')
        .setView([41.398, 2.174], 3);

    var markers = new L.MarkerClusterGroup();

    $.get('http://localhost:3000/search', function(data){
      for(var i=0; i<data.length; i++){
        var latitude = parseFloat(data[i].location.split(',')[0]);
        var longitude = parseFloat(data[i].location.split(',')[1]);
        var title = data[i].text;
        var screen_name = data[i].screen_name;
        var profile_pic = data[i].profile_pic
        var marker = L.marker(new L.LatLng(latitude, longitude), {
            icon: L.mapbox.marker.icon({'marker-symbol': 'post', 'marker-color': '0044FF'}),
            title: title
        });

        map.legendControl.addLegend('<div><img id="tweet_img" src="'+ profile_pic +'"/><strong>'+ screen_name +' </strong>'+title+'</div>');
        console.log(data[i].screen_name);

        marker.bindPopup(title);
        markers.addLayer(marker);
      }

      map.addLayer(markers);
      
    });

