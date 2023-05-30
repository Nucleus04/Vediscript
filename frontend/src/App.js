import './App.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import LandingPage from './ladingPage/LandingPage';
import AuthenticationPage from './Login-Signup-Component/Authentication-page';

function App() {
  return (
    <div className="App">
        <Router>
            <Routes>
                <Route exact path="/" element={<LandingPage />} />
                <Route exact path="/authentication" element={<AuthenticationPage />} />       
            </Routes>
        </Router>
    </div>
  );
}

export default App;
