import session from "../session/session";
import { Navigate } from "react-router-dom";

function Protected({ element }) {
    const currentSession = new session();
    const isThereToken = currentSession.tokenCheck();
    const isThereUserData = currentSession.userDataCheck();
  
    if (isThereToken && isThereUserData) {
      return <>{element}</>;
    } else {
      return <Navigate to="/authentication" />;
    }
  }

export default Protected;