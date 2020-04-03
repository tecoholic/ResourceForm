import React, {useState} from 'react';
import Form from "./components/Form";
import "bulma/css/bulma.min.css";
import "./App.css";
import ThankYou from "./components/ThankYou";

function App() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="App">
      { !submitted ? <Form submitted={setSubmitted}/>: <ThankYou/> }
    </div>
  );
}

export default App;
