// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
/* eslint-disable no-undef */
var map, infoWindow;
import * as api from './api.js';
export function initMap(zoom = 6, callback) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 6
    });
    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            this.getZipCode(position, callback)

            infoWindow.setPosition(pos);
            infoWindow.setContent('You are here.');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
            this.handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        this.handleLocationError(false, infoWindow, map.getCenter());
    }
}

export function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

export function getZipCode(p, callback) {
    const { latitude, longitude } = p.coords;
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBa9bkdOvQKASseggqWGHG13Lq4IaVNBhs`)
        .then((response) => response.json()).then(callback);
}

export function setMarker(markerObj) {
    var myLatLng = new google.maps.LatLng(markerObj.latitude, markerObj.longitude);
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: markerObj.name
    });
    marker.addListener('click', () => {
        api.showWebsite(markerObj.website);
    });

}

export function setMapFromMarker(data) {
    var bounds = new google.maps.LatLngBounds();
    for (var location of data) {
        var item = new google.maps.LatLng(location.latitude, location.longitude);
        bounds.extend(item);
    }
    map.fitBounds(bounds);
}