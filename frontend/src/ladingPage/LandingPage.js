import "./style/style.css";
import { Link } from "react-router-dom";
function LandingPage () {
    return (
        <div className="landing-page">
          <img className="logo" height={100} width={100} src="Vediscript-logo.png" alt="Logo" />
          <h2 className="vediscript">Vediscript</h2>
          <p>A light weight video editing app on the go!</p>
          <div className="video-app">
          </div>
          <Link to = "/authentication">
            <button className="get-started-button">Get Started</button>
          </Link>
        </div>
    );
}

export default LandingPage;