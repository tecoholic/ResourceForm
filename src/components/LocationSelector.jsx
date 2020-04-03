import React, {useState} from "react";

import { Map, Marker, Popup, TileLayer } from 'react-leaflet'


function LocationSelector(props) {
  const [zoom, setZoom] = useState(13);
  const markermoved = (e) => {
    const { lat, lng } = e.target._latlng;
    props.updateLocation([lat, lng]);
  };

  const updateZoomLevel = (e) => {
    setZoom(e.target._zoom);
  };

  return (
    <div>
    <Map center={props.currentLocation} zoom={zoom} className="Map" onzoomend={updateZoomLevel}>
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