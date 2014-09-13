L.mapbox.accessToken = 'pk.eyJ1IjoiYnV6emxpZ2h0eWVhcjE4MiIsImEiOiJtQ1FQWXZNIn0.3Mbs1_mAeGXybLb5OPhsCg';
    var map = L.mapbox.map('map', 'buzzlightyear182.j547ep00')
        .setView([41.398, 2.174], 3);

    var markers = new L.MarkerClusterGroup();

    for (var i = 0; i < addressPoints.length; i++) {
        var a = addressPoints[i];
        var title = a[2];
        var marker = L.marker(new L.LatLng(a[0], a[1]), {
            icon: L.mapbox.marker.icon({'marker-symbol': 'post', 'marker-color': '0044FF'}),
            title: title
        });
        marker.bindPopup(title);
        markers.addLayer(marker);
    }

    map.addLayer(markers);