import { useEffect, useState } from "react";
import "./style.css";
import { useSelector, useDispatch } from "react-redux";
import useShowComponent from "./hooks/useShowComponent";
import { setShowRecordComponent, resetOperation } from "../../../../../redux/OperationAction";
import { setIsThereError, setLoading, setLoadingStatus } from "../../../../../redux/EditingAction";
import { addReplaceAudioHistory } from "../../../../../redux/HistoryTrackerAction";
import startRecording from "./module/startRecordModule";
import useCountdown from "./hooks/useCountdown";
import socket from "../../../../../websocket/socket";
import submitAudio from "./module/submitRecord";

function RecordAudioComponent () {
    const globalOperationState = useSelector((state) => state.operation);
    const showRecordComponent = useShowComponent(globalOperationState);
    const history = useSelector((state) => state.history);
    const dispatch = useDispatch();
    const [showCountdown, setShowCountdown] = useState(false)
    const [isStart, setIsStart] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [audioURL, setAudioURL] = useState("");
    const [audioChunks, setAudioChunks] = useState([]);
    const [counter, setCounter] = useState("");
    const [timeData, setTimeData] = useState("");
    const [startButtonLabel, setStartButtonLabel] = useState("Start");
    const [isReset, setIsReset] = useState(false);
    useCountdown(setCounter, setIsStart, counter, isStart);

    socket.on('replacing-audio', (data) => {
        if(data.state === "start") {
            dispatch(setLoadingStatus(data.message));
            dispatch(setLoading(true));
            dispatch(setShowRecordComponent(false));

        }
        else{
            dispatch(setLoading(false));
            dispatch(setLoadingStatus(""));
        }
    });

    useEffect(() => {
        let time = globalOperationState.initialRemovingData.end - globalOperationState.initialRemovingData.start;
        setCounter(time.toFixed(1));
        setTimeData(time.toFixed(1));
    }, [globalOperationState.initialRemovingData]);

    useEffect(() => {
        if(isReset && audioURL !== ""){
            setAudioChunks([]);
            setAudioURL("");
            setStartButtonLabel("Start");
        }
    }, [audioURL, isReset])

    const handleStart = () => {
        setStartButtonLabel("Start");
        setIsReset(false);
        setShowCountdown(true);

    }
    const handleReset = () => {
        setCounter(timeData);
        setIsStart(false)
        setIsReset(true);
        setCountdown(3);
        setAudioChunks([]);
        setStartButtonLabel("Start");
        setShowCountdown(false); 
    }
    const handleCancel = () => {
        setIsStart(false)
        setAudioChunks([]);
        setCountdown(3);
        setShowCountdown(false);
        setCounter("");
        setAudioURL("");
        setStartButtonLabel("Start");
        dispatch(setShowRecordComponent(false)); 
        dispatch(resetOperation());
    }

    useEffect(() => {
        if (countdown >= 0 && showCountdown) {
            if(countdown === 0){
                console.log("Calling recording");
                startRecording(setIsStart, audioChunks, setAudioURL, setStartButtonLabel, counter);
            }
            const timer = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);
    
            return () => {
                clearInterval(timer);
            };
        } else {
            setShowCountdown(false);
        }
    }, [countdown, showCountdown]);
    
    const onResponse = (state, data) => {
        if(state){
            dispatch(addReplaceAudioHistory(data.script))
            const error = {
                state: true,
                status: "success",
                message: "Replacing audio successfully!"
            }
            dispatch(setIsThereError(error));
        } else{
            const error = {
                state: false,
                status: "fail",
                message: "Removing audio failed..."
            }
            dispatch(setIsThereError(error));
        }  
        setIsStart(false)
        setAudioChunks([]);
        setCountdown(3);
        setShowCountdown(false);
        setCounter("");
        setAudioURL("");
        setStartButtonLabel("Start");
        dispatch(setShowRecordComponent(false)); 
        dispatch(resetOperation());
    }
    const handleSubmit = () => {
        submitAudio(
            audioChunks,
            globalOperationState.initialRemovingData.start,
            globalOperationState.initialRemovingData.end,
            history.currentHistoryIndex,
            onResponse,
            history,
            );
    }
    return(
        <div className={`record-audio-modal-container ${showRecordComponent? "" : "display-none"}`}>
            <div className={`countdown-record-container ${showCountdown? "" : "display-none"}`}>
                    <div className="countdown-circle">
                        <p>{countdown}</p>
                    </div>
                </div>
            <div className="record-audio-modal">
                
                <div className="record-audio-display-contianer">
                    <p>Record</p>
                    <h2 className="record-audio-counter">{counter}s</h2>
                    <div className="audio-player-container"><audio src={audioURL} controls aria-disabled></audio></div>
                    <div className="record-audio-button-container">
                        <button className="record-audio-button" onClick={startButtonLabel === "Start" ? handleStart : handleSubmit} disabled={isStart? true : false}>{startButtonLabel}</button>
                        <button className="record-audio-button" onClick={handleReset}>Reset</button>
                        <button className="record-audio-button" onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecordAudioComponent;