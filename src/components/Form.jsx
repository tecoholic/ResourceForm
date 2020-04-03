import React, {useEffect, useState, useRef} from "react";
import {useForm} from "react-hook-form";
import LocationSelector from "./LocationSelector";
import axios from "axios";

const Form = (props) => {
  const { handleSubmit, register, errors } = useForm();
  const [currentLocation, setCurrentLocation] = useState([15, 78]);
  const [locationFetched, setLocationFetched] = useState(false);
  const [error, setError] = useState(null);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const image1Input = useRef();
  const image2Input = useRef();
  const [image1, setImage1] = useState({file: "", preview: ""});
  const [image2, setImage2] = useState({file: "", preview: ""});

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
    setSubmittingForm(true);
    const data = values;
    data['location'] = `http://www.google.com/maps/place/${currentLocation[0]},${currentLocation[1]}`;
    axios.get(props.url, {params: data}).then(resp => {
      props.submitted(true);
    }).catch(err => {
      setSubmissionError("Failed to send request!")
    });
  };

  const loadImage1 = () => {
    const reader = new FileReader();
    let file = image1Input.current.files[0];
    reader.onloadend = () => {
      setImage1({
        file: file,
        preview: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  const loadImage2 = () => {
    const reader = new FileReader();
    let file = image2Input.current.files[0];
    reader.onloadend = () => {
      setImage2({
        file: file,
        preview: reader.result
      });
    };
    reader.readAsDataURL(file);
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
        <label className="label" htmlFor="address">Location</label>
        <div className="control">
          <input
            name="location"
            id="location"
            className="input"
            ref={register({
              required: "Required"
            })}
          />
        </div>
        {errors.location && errors.location.message ?
          <p className="help is-danger">{ errors.location.message }</p> :
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

      <h4 className="has-text-weight-bold">Photo 1</h4>
      <div className="file">
        <label className="file-label">
          <input
            className="file-input"
            type="file"
            name="image_1"
            id="image_1"
            accept="image/*"
            ref={image1Input}
            onChange={loadImage1}
          />
          <span className="file-cta">
            <span className="file-label">
              Choose a file…
            </span>
          </span>
        </label>
      </div>

      <figure className="image my">
        <img src={image1.preview} alt=""/>
      </figure>

      <h4 className="has-text-weight-bold">Photo 2</h4>
      <div className="file">
        <label className="file-label">
          <input
            className="file-input"
            type="file"
            name="image_2"
            id="image_2"
            accept="image/*"
            ref={image2Input}
            onChange={loadImage2}
          />
          <span className="file-cta">
            <span className="file-label">
              Choose a file…
            </span>
          </span>
        </label>
      </div>

      <figure className="image my">
        <img src={image2.preview} alt=""/>
      </figure>

      <div className="field">
        <div className="control">
          <button className={'button is-link' + (submittingForm ? ' is-loading': '') }>Submit</button>
        </div>
      </div>

    </form>
  );

};

export default Form;
