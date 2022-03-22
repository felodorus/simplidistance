let lat, lon;
let getUserLocation = new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(function (pos) {
        lat = pos.coords.latitude
        lon = pos.coords.longitude
        resolve({ lat, lon });
    })
})

getUserLocation.then(function (value) {
    // Konstanten
    let latUser = value.lat
    let lonUser = value.lon
    const latSimplias = 51.33527465676566
    const lonSimplias = 12.336798602421561

    const toRadian = angle => (Math.PI / 180) * angle;
    const distance = (a, b) => (Math.PI / 180) * (a - b);
    const RADIUS_OF_EARTH_IN_KM = 6371;

    const dLat = distance(latSimplias, latUser);
    const dLon = distance(lonSimplias, lonUser);

    latUserRad = toRadian(latUser);
    latSimpliasRad = toRadian(latSimplias);

    // Haversine Formel
    const a =
        Math.pow(Math.sin(dLat / 2), 2) +
        Math.pow(Math.sin(dLon / 2), 2) * Math.cos(latUser) * Math.cos(latSimplias);
    const c = 2 * Math.asin(Math.sqrt(a));

    let finalDistance = RADIUS_OF_EARTH_IN_KM * c;

    // DOM
    document.querySelector('.progress').style.display = "none";
    document.querySelector('.prog2').style.display = "none";
    const location = document.querySelector('.location');

    location.textContent = lat + ' ' + lon;

    const distanceDom = document.querySelector('.distance');

    distanceDom.textContent = finalDistance.toFixed(3) + ' KM';

    console.log();
});





