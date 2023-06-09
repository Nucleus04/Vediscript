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
            setShowLoading(true);
            setLoadingStatus(globalState.loadingStatus)
        }
        if(globalState.isThereSuccessEvent.state === true){
            setSuccess(globalState.isThereSuccessEvent.state);
            setSuccessMessage(globalState.isThereSuccessEvent.message);
        }
    }, [globalState]);

    const handleOk = () => {
        let data = {
            state: false,
            message: "",
        }
        dispatch(setLoading(false));
        //dispatch(setSuccessEvent(data));
        dispatch(setLoadingStatus(""));
        setShowLoading(false);

    }
    return (
    <div className={`loading-background ${showLoading? "": `display-none`}`}>
        <div className="loader-container">
            <div className={`loader ${success? `success` : ""}`}>
                <div className={`lds-spinner ${success? `display-none` : ``}`}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
            <p>{success? successMessage :loadinStatus}</p>
            <button onClick={handleOk}>ok</button>
        </div>
      
    </div>
    );
}

export default EditingLoadingComponent;