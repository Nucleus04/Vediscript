import "./style/style.css";
import { Link } from "react-router-dom";
function LandingPage () {
    return (
        <div className="landing-page">
            <div className="landing-page-left">
                <div className="landing-page-left-mini">
                    <div className="display-flex">
                        <img className="logo" height={100} width={100} src="Vediscript-logo.png" alt="Logo" />
                        <p className="vediscript">ediscript</p>
                    </div>
                    <p className="landing-page-description">A light weight video editing app on the go!</p>
                    <Link to = "/authentication">
                        <button className="get-started-button">Get Started!</button>
                    </Link>
                </div>
            </div>
            <div className="landing-page-right">

            </div>


        </div>
    );
}

export default LandingPage;