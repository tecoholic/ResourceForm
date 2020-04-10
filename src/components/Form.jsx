import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { useForm } from "react-hook-form";
import LocationSelector from "./LocationSelector";
import PhotoSelector from "./PhotoSelector";
import axios from "axios";
import { createAlbum, addPhoto } from "../utils/upload_images";

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
      await axios.get(props.url, { params: data });
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
        <label className="label" htmlFor="leader_name">Group Leader Name</label>
        <div className="control">
          <input
            className="input"
            type="text"
            id="leader_name"
            name="leader_name"
            ref={register({
              required: 'Required'
            })}
          />
        </div>
        {errors.leader_name && errors.leader_name.message ?
          <p className="help is-danger">{errors.leader_name.message}</p> :
          <></>}
      </div>
      <div className="field">
        <label className="label" htmlFor="leader_mobile">Group Leader Mobile Number</label>
        <div className="control">
          <input
            className="input"
            type="text"
            name="leader_mobile"
            id="leader_mobile"
            ref={register({
              required: 'Required',
              pattern: {
                value: /^\d{10}$/i,
                message: "Mobile number should contain 10 digits"
              }
            })}
          />
        </div>
        {errors.leader_mobile && errors.leader_mobile.message ?
          <p className="help is-danger">{errors.leader_mobile.message}</p> :
          <></>}
      </div>
      <div className="field">
        <label htmlFor="group_state" className="label">Group's Native State</label>
        <div className="control">
          <div className="select">
            <select name="group_state" id="group_state" ref={register}>
              <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
              <option value="Assam">Assam</option>
              <option value="Bihar">Bihar</option>
              <option value="Chandigarh">Chandigarh</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
              <option value="Delhi">Delhi</option>
              <option value="Goa">Goa</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Haryana">Haryana</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Jammu & Kashmir">Jammu & Kashmir</option>
              <option value="Jharkhand">Jharkhand</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Ladakh">Ladakh</option>
              <option value="Lakshadweep">Lakshadweep</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Manipur">Manipur</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Mizoram">Mizoram</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Odisha">Odisha</option>
              <option value="Puducherry">Puducherry</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Tripura">Tripura</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="West Bengal">West Bengal</option>
            </select>
          </div>
        </div>
      </div>
      <div className="field">
        <label className="label" htmlFor="present_address">Present Address</label>
        <div className="control">
          <input
            className="input"
            type="text"
            id="present_address"
            name="present_address"
            ref={register({
              required: 'Required'
            })}
          />
        </div>
        {errors.present_address && errors.present_address.message ?
          <p className="help is-danger">{errors.present_address.message}</p> :
          <></>}
      </div>
      <div className="field">
        <label htmlFor="present_district" className="label">Present District</label>
        <div className="control">
          <div className="select">
            <select name="present_district" id="present_district" ref={register}>
              <option value="Bagalkote">Bagalkote</option>
              <option value="Ballari">Ballari</option>
              <option value="Belagavi">Belagavi</option>
              <option value="Bengaluru Urban">Bengaluru Urban</option>
              <option value="Bengaluru Rural">Bengaluru Rural</option>
              <option value="Bidar">Bidar</option>
              <option value="Chamarajanagara">Chamarajanagara</option>
              <option value="Chikkaballapura">Chikkaballapura</option>
              <option value="Chikkmagaluru">Chikkmagaluru</option>
              <option value="Chitradurga">Chitradurga</option>
              <option value="Dakshina Kannada">Dakshina Kannada</option>
              <option value="Davanagere">Davanagere</option>
              <option value="Dharawada">Dharawada</option>
              <option value="Gadaga">Gadaga</option>
              <option value="Hassan">Hassan</option>
              <option value="Haveri">Haveri</option>
              <option value="Kalaburagi">Kalaburagi</option>
              <option value="Kodagu">Kodagu</option>
              <option value="Kolara">Kolara</option>
              <option value="Koppala">Koppala</option>
              <option value="Mandya">Mandya</option>
              <option value="Mysuru">Mysuru</option>
              <option value="Raichur">Raichur</option>
              <option value="Ramanagara">Ramanagara</option>
              <option value="Shivamogga">Shivamogga</option>
              <option value="Tumakuru">Tumakuru</option>
              <option value="Udupi">Udupi</option>
              <option value="Uttara Kannada">Uttara Kannada</option>
              <option value="Vijayapura">Vijayapura</option>
              <option value="Yadagiri">Yadagiri</option>
            </select>
          </div>
        </div>
      </div>
      <div className="field">
        <label className="label" htmlFor="present_landmark">Present Landmark</label>
        <div className="control">
          <input
            className="input"
            type="text"
            id="present_landmark"
            name="present_landmark"
            ref={register({
              required: 'Required'
            })}
          />
        </div>
        {errors.present_landmark && errors.present_landmark.message ?
          <p className="help is-danger">{errors.present_landmark.message}</p> :
          <></>}
      </div>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <label className="label" htmlFor="total_men">Total Men</label>
          <div className="control">
            <input
              className="input"
              type="number"
              id="total_men"
              name="total_men"
              ref={register({
                required: 'Required'
              })}
            />
          </div>
          {errors.total_men && errors.total_men.message ?
            <p className="help is-danger">{errors.total_men.message}</p> :
            <></>}
        </Grid>
        <Grid item xs={12} sm={6}>
          <label className="label" htmlFor="total_women">Total Women</label>
          <div className="control">
            <input
              className="input"
              type="number"
              id="total_women"
              name="total_women"
              ref={register({
                required: 'Required'
              })}
            />
          </div>
          {errors.total_women && errors.total_women.message ?
            <p className="help is-danger">{errors.total_women.message}</p> :
            <></>}
        </Grid>
        <Grid item xs={12} sm={6}>
          <label className="label" htmlFor="total_children">Total Children (under 16)</label>
          <div className="control">
            <input
              className="input"
              type="number"
              id="total_children"
              name="total_children"
              ref={register({
                required: 'Required'
              })}
            />
          </div>
          {errors.total_children && errors.total_children.message ?
            <p className="help is-danger">{errors.total_children.message}</p> :
            <></>}
        </Grid>
        <Grid item xs={12} sm={6}>
          <label className="label" htmlFor="total_person">Total Person in Group</label>
          <div className="control">
            <input
              className="input"
              type="number"
              id="total_person"
              name="total_person"
              ref={register({
                required: 'Required'
              })}
            />
          </div>
          {errors.total_person && errors.total_person.message ?
            <p className="help is-danger">{errors.total_person.message}</p> :
            <></>}
        </Grid>
        <Grid item xs={12} sm={6}>
          <label className="label" htmlFor="special_request">Special Request other than Food / Grocery</label>
          <div className="control">
            <input
              className="input"
              type="text"
              id="special_request"
              name="special_request"
              ref={register({
                required: 'Required'
              })}
            />
          </div>
          {errors.special_request && errors.special_request.message ?
            <p className="help is-danger">{errors.special_request.message}</p> :
            <></>}
        </Grid>
        <Grid item xs={12} sm={6}>
          <label className="label" htmlFor="post_lockdown">Post Lockdown Will Your Group:</label>
          <div className="control">
            <div className="radio">
              <label>
                <input type="radio" name="post_lockdown" value="Stay" ref={register} />
                Stay At Present Place
              </label>
            </div>
            <div className="radio">
              <label>
                <input type="radio" name="post_lockdown" value="Leave" ref={register} />
                Go to Native
              </label>
            </div>
          </div>
        </Grid>
      </Grid>

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
      <PhotoSelector setFile={setImage1} />

      <h4 className="has-text-weight-bold">Location Photo</h4>
      <PhotoSelector setFile={setImage2} />

      <div className="field">
        <div className="control">
          <button className={'button is-link' + (submittingForm ? ' is-loading' : '')}>Submit</button>
        </div>
      </div>

    </form>
  );

};

export default Form;
