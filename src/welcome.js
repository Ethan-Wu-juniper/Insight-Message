import React from 'react';
import './welcome.css';
import "bootstrap/dist/css/bootstrap.min.css"
import { useNavigate } from "react-router-dom";


function WelcomePage() {
  const navigate = useNavigate();

  const start = () => {
    navigate("/login");
  }
  return (
    <div className="WelcomePage">
      <div className="WelcomePageTitle">
        {/* <img src="logo192.png" alt="App Logo" /> */}
        <h1>Insight Message</h1>
      </div>
      <div className="Paragraph">
        <p>Insight Message is an app that allows you to scrape messages from Facebook, analyze the emotions conveyed in those messages, and show you statistical results based on the data gathered.</p>
      </div>
      <div className="LoginButton">
        <button onClick={start} type="button" class="btn btn-dark" data-toggle="button" aria-pressed="false" autocomplete="off">
          Start Analyzing
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;
