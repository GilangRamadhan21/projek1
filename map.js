// Inisialisasi peta di tengah Lampung Timur
var map = L.map('map').setView([-5.1100, 105.6700], 9);

// Tambahkan base layer
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 5,
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
});

// Menambahkan layer default
osm.addTo(map);

// Layer batas administrasi
var batasadministrasilamtim = L.geoJSON(null, {
    style: function(feature) {
        return {
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0
        };
    }
});

// Memanggil file GeoJSON batas administrasi desa
fetch('geojeson/batasadministrasilamtim.geojson')
    .then(response => response.json())
    .then(data => {
        console.log("Data GeoJSON Batas administrasi:", data);
        batasadministrasilamtim.addData(data);
    })
    .catch(error => console.error("Error memuat GeoJSON batas desa: ", error));

// Layer jaringan jalan
var jaringanJalan = L.geoJSON(null, {
    style: function(feature) {
        return {
            color: "red",
            weight: 1,
            opacity: 1
        };
    }
});

// Memanggil file GeoJSON jaringan jalan
fetch('geojeson/jaringanjalan.geojson')
    .then(response => response.json())
    .then(data => {
        console.log("Data GeoJSON Jaringan Jalan:", data);
        jaringanJalan.addData(data);
    })
    .catch(error => console.error("Error memuat GeoJSON jaringan jalan: ", error));

// Layer koordinat pariwisata
var koordinatpariwisata = L.geoJSON(null, {
    pointToLayer: function(feature, latlng) {
        return L.marker(latlng).bindPopup(
            "<b>" + feature.properties.Nama + "</b>" +
            "<p style='text-align: justify; margin-bottom: 15px;'>" + 
            feature.properties.Deskripsi.replace(/\n/g, "<br>&emsp;") + 
            "</p>" +
            "<img src='" + feature.properties.Foto + "' width='300px' style='display: block; margin: auto; border-radius: 8px;'>"
        );
    }
});


// Memanggil file GeoJSON koordinat pariwisata
fetch('geojeson/koordinatpariwisata.geojson')
    .then(response => response.json())
    .then(data => {
        console.log("Data GeoJSON koordinat pariwisata:", data);
        koordinatpariwisata.addData(data);
        map.addLayer(koordinatpariwisata); // Tambahkan layer ke peta agar terlihat
    })
    .catch(error => console.error("Error memuat GeoJSON koordinat pariwisata: ", error));

// Base maps
var baseMaps = {
    "OpenStreetMap": osm,
    "OpenStreetMap HOT": osmHOT
};

// Overlay layers
var overlayMaps = {
    "Batas Administrasi": batasadministrasilamtim,
    "Jaringan Jalan": jaringanJalan,
    "Koordinat Pariwisata": koordinatpariwisata
};

// Tambahkan kontrol layer ke peta
L.control.layers(baseMaps, overlayMaps, { collapsed: true }).addTo(map);
