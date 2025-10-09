const key = mapToken;

const map = new maplibregl.Map({
  container: "map",
  style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${key}`,
  center: listing.geometry.coordinates,
  zoom: 9,
});

map.addControl(new maplibregl.NavigationControl());
map.scrollZoom.disable();

const marker = new maplibregl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .addTo(map);

const popup = new maplibregl.Popup({
  offset: 25, // distance from marker
})

  .setLngLat(listing.geometry.coordinates) // popup position
  .setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`) // You can use your own HTML here
  .addTo(map);

// Optional: link popup to marker (so it shows when clicked)
marker.setPopup(popup);
