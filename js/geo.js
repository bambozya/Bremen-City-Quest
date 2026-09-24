/* Geolocation helpers: distance, bearing, position watching, compass heading. */
(function (global) {
  "use strict";

  var R = 6371000; // earth radius in metres
  function rad(d) { return d * Math.PI / 180; }
  function deg(r) { return r * 180 / Math.PI; }

  /* Great-circle distance in metres. */
  function distance(a, b) {
    var dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
    var s = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  }

  /* Initial bearing from a to b, 0..360 clockwise from true north. */
  function bearing(a, b) {
    var y = Math.sin(rad(b.lng - a.lng)) * Math.cos(rad(b.lat));
    var x = Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) -
      Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(rad(b.lng - a.lng));
    return (deg(Math.atan2(y, x)) + 360) % 360;
  }

  function formatDistance(m) {
    if (m < 1000) return Math.round(m) + " m";
    return (m / 1000).toFixed(1) + " km";
  }

  function mapsUrl(loc) {
    return "https://www.google.com/maps/dir/?api=1&destination=" + loc.lat + "," + loc.lng + "&travelmode=walking";
  }

  /* Watches GPS. onPos({lat,lng,accuracy}), onErr(message). Returns stop(). */
  function watch(onPos, onErr) {
    if (!navigator.geolocation) { onErr("Geolocation is not supported by this browser."); return function () {}; }
    var id = navigator.geolocation.watchPosition(function (p) {
      onPos({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy });
    }, function (e) {
      var msg = e.code === 1 ? "Location permission denied." : e.code === 2 ? "Position unavailable." : "Location timeout.";
      onErr(msg);
    }, { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 });
    return function () { navigator.geolocation.clearWatch(id); };
  }

  /* Compass heading (degrees clockwise from north) via device orientation.
   * iOS needs a user-gesture permission request; call from a click handler. */
  function watchHeading(onHeading) {
    function handler(e) {
      var h = null;
      if (typeof e.webkitCompassHeading === "number") h = e.webkitCompassHeading;      // iOS
      else if (e.absolute && typeof e.alpha === "number") h = (360 - e.alpha) % 360;   // Android absolute
      if (h !== null && !isNaN(h)) onHeading(h);
    }
    function attach() {
      if ("ondeviceorientationabsolute" in window) window.addEventListener("deviceorientationabsolute", handler, true);
      else window.addEventListener("deviceorientation", handler, true);
    }
    var DOE = window.DeviceOrientationEvent;
    if (DOE && typeof DOE.requestPermission === "function") {
      return DOE.requestPermission().then(function (state) {
        if (state === "granted") attach();
        return state === "granted";
      }).catch(function () { return false; });
    }
    attach();
    return Promise.resolve(true);
  }

  global.Geo = { distance: distance, bearing: bearing, formatDistance: formatDistance, mapsUrl: mapsUrl, watch: watch, watchHeading: watchHeading };
})(window);
