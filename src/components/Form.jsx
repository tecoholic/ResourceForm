import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import LocationSelector from "./LocationSelector";
import PhotoSelector from "./PhotoSelector";
import axios from "axios";
import {createAlbum, addPhoto} from "../utils/upload_images";

const Form = (props) => {
  const status = {
    PENDING: 0,
    STARTED: 1,
    COMPLETE: 2,
    ERROR: 3
  };
  const { handleSubmit, register, errors } = useForm();
  const [currentLocation, setCurrentLocation] = useState([15, 78]);
  const [locationFetched, setLocationFetched] = useState(false);
  const [error, setError] = useState(null);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [upload1, setUpload1] = useState(status.PENDING);
  const [upload2, setUpload2] = useState(status.PENDING);

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

  const onSubmit = async (values) => {
    const data = values;
    setSubmittingForm(true);

    // Create S3 Album and upload the photos
    let album = '';
    try {
      album = await createAlbum();
    } catch (e) {
      alert("Cannot Upload Photos!");
      return;
    }

    if (image1) {
      try {
        const obj = await addPhoto(album, image1, values.mobile_no);
        setUpload1(status.COMPLETE);
        data["image_1"] = obj.Location;
      } catch (e) {
        setUpload1(status.ERROR)
      }
    }

    if (image2) {
      try {
        const obj = await addPhoto(album, image2, values.mobile_no);
        setUpload1(status.COMPLETE);
        data["image_2"] = obj.Location;
      } catch (e) {
        setUpload2(status.ERROR)
      }
    }

    data['location_gps'] = `http://www.google.com/maps/place/${currentLocation[0]},${currentLocation[1]}`;
    try {
      await axios.get(props.url, {params: data});
      props.submitted(true);
    } catch (e) {
      setSubmissionError("Failed to send request!")
    }
  };

  return (
    <form className="section" onSubmit={handleSubmit(onSubmit)}>
      {
        submissionError ?
        <div className="notificaiton is-danger">{submissionError}</div> :
        <></>
      }
      <div className="field">
        <label htmlFor="date" className="label">Date</label>
        <div className="control">
          <input
            className="input"
            type="date"
            id="date"
            name="date"
            ref={register({required: "Required"})}
            defaultValue={new Date().toISOString().split("T")[0]}
            disabled={true}
          />
        </div>
        {errors.date && errors.date.message ?
          <p className="help is-danger">{ errors.date.message }</p> :
          <></>}
      </div>
      <div className="field">
        <label className="label" htmlFor="name">Volunteer Name</label>
        <div className="control">
          <input
            className="input"
            type="text"
            id="volunteer_name"
            name="volunteer_name"
            ref={register({
              required: 'Required'
            })}
          />
        </div>
        {errors.volunteer_name && errors.volunteer_name.message ?
          <p className="help is-danger">{ errors.volunteer_name.message }</p> :
          <></>}
      </div>

      <div className="field">
        <label className="label" htmlFor="mobile_no">Mobile Number</label>
        <div className="control">
          <input
            className="input"
            type="text"
            name="mobile_no"
            id="mobile_no"
            ref={register({
              required: 'Required',
              pattern: {
                value: /^\d{10}$/i,
                message: "Mobile number should contain 10 digits"
              }
            })}
          />
        </div>
        {errors.mobile_no && errors.mobile_no.message ?
          <p className="help is-danger">{ errors.mobile_no.message }</p> :
          <></>}
      </div>

      <div className="field">
        <label htmlFor="time" className="label">Time</label>
        <div className="control">
          <div className="select">
            <select name="time" id="time" ref={register} defaultValue="morning">
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
            </select>
          </div>
        </div>
      </div>

      <div className="field">
        <label htmlFor="vehicle_number" className="label">Vehicle Number</label>
        <div className="control">
          <input
            className="input"
            type="text"
            name="vehicle_number"
            id="vehicle_number"
            ref={register({required: "Required"})}
          />
        </div>
        {errors.vehicle_number && errors.vehicle_number.message ?
          <p className="help is-danger">{ errors.vehicle_number.message }</p> :
          <></>}
      </div>

      <div className="field">
        <label className="label" htmlFor="location_name">Location</label>
        <div className="control">
          <input
            name="location_name"
            id="location_name"
            className="input"
            ref={register({
              required: "Required"
            })}
          />
        </div>
        {errors.location_name && errors.location_name.message ?
          <p className="help is-danger">{ errors.location_name.message }</p> :
          <></>}
      </div>

      <div className="field">
        <div className="field">
          {error ? <div className="notification is-warning">{error}</div> : <></>}
          <p className="help is-info">
            Drag the <strong>blue marker</strong> to the correct location if necessary.
          </p>
          <LocationSelector currentLocation={currentLocation} updateLocation={setCurrentLocation} />
        </div>
      </div>

      <h4 className="has-text-weight-bold">Landmark Photo</h4>
      <PhotoSelector setFile={setImage1}/>

      <h4 className="has-text-weight-bold">Location Photo</h4>
      <PhotoSelector setFile={setImage2}/>

      <div className="field">
        <div className="control">
          <button className={'button is-link' + (submittingForm ? ' is-loading': '') }>Submit</button>
        </div>
      </div>

    </form>
  );

};

export default Form;
