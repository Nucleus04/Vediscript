import ProjectPreviewLayout from '../views/projectPreview/projectPreviewLayout';
import { BrowserRouter as Router, Route, Link,Navigate, Routes } from 'react-router-dom';
import AuthenticationPage from '../views/Login-Signup-Component/Authentication-page';
import LandingPage from '../views/ladingPage/LandingPage';
import session from '../session/session';
import Protected from '../middleware';

function Routers () {
    const currentsession = new session();
    const isTheretoken = currentsession.tokenCheck();
    const isThereUserData = currentsession.userDataCheck();
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={isTheretoken && isThereUserData ? (
                    <Navigate to="/project-preview" />) : (<LandingPage />)}/>
                <Route exact path="/authentication" element={<AuthenticationPage />} />
                <Route exact path="/project-preview" element={<Protected element={<ProjectPreviewLayout />} />}/>       
            </Routes>
        </Router>
    )
}

export default Routers;