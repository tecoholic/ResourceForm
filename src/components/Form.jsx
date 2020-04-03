import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import LocationSelector from "./LocationSelector";
import axios from "axios";

const URL = "https://script.google.com/macros/s/AKfycbwHj7uu5r3VI8jjCvegFaKHFGuMT2vmldRHqc-XN1_6g9KZyog/exec";

const Form = () => {
  const { handleSubmit, register, errors } = useForm();
  const [currentLocation, setCurrentLocation] = useState([78, 15]);
  const [locationFetched, setLocationFetched] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (locationFetched) {
      return;
    }

    function success(position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      setCurrentLocation([lat, lon]);
      setLocationFetched(true);
    }
    function error() {
      setError("Cannot get the location from your device.");
    }

    navigator.geolocation.getCurrentPosition(success, error);
  }, [locationFetched]);

  const onSubmit = values => {
    const data = values;
    data['location'] = `http://www.google.com/maps/place/${currentLocation[0]},${currentLocation[1]}`;
    axios.get(URL, {params: data}).then(resp => {
      console.log(resp)
    });
  };
  
  return (
    <form className="section" onSubmit={handleSubmit(onSubmit)}>
      <div className="field">
        <label className="label" htmlFor="name">Name</label>
        <div className="control">
          <input
            className="input"
            type="text"
            id="name"
            name="name"
            ref={register({
              required: 'Required'
            })}
          />
        </div>
        {errors.name && errors.name.message ?
          <p className="help is-danger">{ errors.name.message }</p> :
          <></>
        }
      </div>

      <div className="field">
        <label className="label" htmlFor="phoneNumber">Phone Number</label>
        <div className="control">
          <input
            className="input"
            type="text"
            name="phone"
            id="phoneNumber"
            ref={register({
              required: 'Required',
              pattern: {
                value: /^\d{10}$/i,
                message: "Invalid Phone Number"
              }
            })}
          />
        </div>
        {errors.phone && errors.phone.message ?
          <p className="help is-danger">{ errors.phone.message }</p> :
          <></>
        }
      </div>

      <div className="field">
        <label htmlFor="food_packets" className="label">Food Packets</label>
        <div className="control">
          <input
            type="number"
            className="input"
            id="food_packets"
            name="food_packets"
            min={0}
            ref={register({
              required: 'Required',
              pattern: {
                value: /^\d*$/i,
                message: "Invalid number"
              }
            })}
          />
        </div>
        {
          errors.food_packets && errors.food_packets.message ?
            <p className="help is-danger">{ errors.food_packets.message }</p> :
            <></>
        }
      </div>

      <div className="field">
        <label className="label" htmlFor="address">Address</label>
        <div className="control">
          <textarea
            name="address"
            id="address"
            className="textarea"
            ref={register({
              required: "Required"
            })}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="location" className="label">
          Location
        </label>
        <div className="field">
          {error ? <div className="notification is-warning">{error}</div> : <></>}
          <p className="help is-info">
            Drag the <strong>blue marker</strong> to the correct location if necessary.
          </p>
          <LocationSelector currentLocation={currentLocation} updateLocation={setCurrentLocation} />
        </div>
      </div>

      <div className="field">
        <div className="control">
          <button className="button is-link">Submit</button>
        </div>
      </div>





    </form>
  );

};

export default Form;
