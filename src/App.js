import React, {useState} from 'react';
import Form from "./components/Form";
import "bulma/css/bulma.min.css";
import "./App.css";
import ThankYou from "./components/ThankYou";
import { GOOGLE_MACRO_URL } from "./config";

function App() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="App">
      <div className="has-text-centered"><img src="LabourDept.jpg" alt="Labour Department" /></div>
      <h1 className="is-size-4 has-text-centered">Labours Heatmap Form</h1>
      { !submitted ? <Form url={GOOGLE_MACRO_URL} submitted={setSubmitted}/>: <ThankYou/> }
    </div>
  );
}

export default App;
