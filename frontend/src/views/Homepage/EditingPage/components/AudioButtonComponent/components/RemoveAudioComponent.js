import { setIsRemovingAudio, setIsThereCurrentOperation } from "../../../../../../redux/OperationAction";
import { useDispatch } from "react-redux";
import constants from "../../../../../../constant/constant";


function RemoveAudioComponent () {

    const dispatch = useDispatch();
    const constant = constants();
    const handleOnclickRemoveAudio = () => {
        console.log("Removing Audio...");
        dispatch(setIsRemovingAudio(true));
        dispatch(setIsThereCurrentOperation({state: true, operation: constant.operation.remove_audio}));
    }
    return (
        <div>
            <button className="audio-child-button" onClick={handleOnclickRemoveAudio}>Remove</button>
        </div>
    )
}
export default RemoveAudioComponent;