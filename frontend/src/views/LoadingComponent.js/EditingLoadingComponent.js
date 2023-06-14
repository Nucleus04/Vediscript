import "./styles/style.css";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSuccessEvent, setLoading,} from "../../redux/EditingAction";

function EditingLoadingComponent () {
    const [showLoading, setShowLoading] = useState(false);
    const [loadinStatus, setLoadingStatus] = useState("");
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const dispatch = useDispatch();

    const globalState = useSelector((state) => state.edit);
    useEffect(() => {
        if(globalState.isLoading === true) {
            setShowLoading(globalState.isLoading);
            setLoadingStatus(globalState.loadingStatus)
        }
        else {
            setShowLoading(globalState.isLoading);
            setLoadingStatus(globalState.loadingStatus)
        }
        // if(globalState.isThereSuccessEvent.state === true){
        //     setSuccess(globalState.isThereSuccessEvent.state);
        //     setSuccessMessage(globalState.isThereSuccessEvent.message);
        // }
    }, [globalState]);

    
    return (
    <div className={`loading-background z-index-10 ${showLoading? "": `display-none`}`}>
        <div className="loader-container">
            <div className={`loader`}>
                <div className={`lds-spinner `}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
            <p>{loadinStatus}</p>
        </div>
      
    </div>
    );
}

export default EditingLoadingComponent;