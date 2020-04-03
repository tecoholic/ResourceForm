import React from "react";

import { Map, Marker, Popup, TileLayer } from 'react-leaflet'


function LocationSelector(props) {
  const markermoved = (e) => {
    const { lat, lng } = e.target._latlng;
    props.updateLocation([lat, lng]);
  };

  return (
    <div>
    <Map center={props.currentLocation} zoom={13} className="Map">
      <TileLayer
        url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
      <Marker position={props.currentLocation} draggable={true} onMoveEnd={markermoved}>
        <Popup>Drag this to the correct location</Popup>
      </Marker>
    </Map>
    </div>
  );

}

export default LocationSelector;