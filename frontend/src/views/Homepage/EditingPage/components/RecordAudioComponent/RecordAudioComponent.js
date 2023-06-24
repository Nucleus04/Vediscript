import { useEffect, useState } from "react";
import "./style.css";
import { useSelector } from "react-redux";
import useShowComponent from "./hooks/useShowComponent";

function RecordAudioComponent () {
    const globalOperationState = useSelector((state) => state.operation);
    const showRecordComponent = useShowComponent(globalOperationState);
    const [showCountdown, setShowCountdown] = useState(false)
    const [isStart, setIsStart] = useState(false);
    const [countdown, setCountdown] = useState(3);

    const [audioChunks, setAudioChunks] = useState([]);
    let mediaRecorder;
    const [counter, setCounter] = useState("");
    useEffect(() => {
        setCounter(globalOperationState.initialRemovingData.end);
    }, [globalOperationState.initialRemovingData])
    console.log(counter);
    const handleStart = async() => {
        try {
            const getUserPermision =  await navigator.mediaDevices.getUserMedia({audio: true});

            if(getUserPermision) {
                mediaRecorder = new MediaRecorder(getUserPermision);
                console.log("started");
                mediaRecorder.start();
            
               

                console.log(mediaRecorder.state);

                mediaRecorder.addEventListener("start", () => {
                    setIsStart(true);
                    console.log("Recording actually start");
                })


                


            const dataPromise = new Promise((resolve) => {
                mediaRecorder.ondataavailable = (event) => {
                  console.log("------", event.data);
                  audioChunks.push(event.data); // Add data to audioChunks array
                }
                mediaRecorder.onstop= () => {
                    console.log("Stopppppped");
                    console.log(audioChunks);
                    console.log("Stopppppped");
                    resolve();
                   
                }
            });
            setTimeout(async() =>{
                mediaRecorder.stop();
                await dataPromise;

                const blob = new Blob(audioChunks, { type: 'audio/mp4' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'recorded_audio123.mp4';
                a.click();
                URL.revokeObjectURL(url);
            }, counter * 1000)
            }

        } catch (error) {
            console.log("There is error on recording video", error);
        }



      
    }

    const handleStop = () => {
        if(mediaRecorder)
            mediaRecorder.stop();
    }

    // useEffect(() => {
    //     if (countdown > -1 && showCountdown) {
    //         const timer = setInterval(() => {
    //             setCountdown(prevCountdown => prevCountdown - 1);
    //         }, 1000);
    
    //         return () => {
    //             clearInterval(timer);
    //         };
    //     } else {
    //         setShowCountdown(false);
    //         setIsStart(true);
    //     }
    // }, [countdown, showCountdown]);

    
    // const startRecording = () => {
    //     navigator.mediaDevices.getUserMedia({audio: true})
    //     .then(stream => {
    //         mediaRecorder = new MediaRecorder(stream);
    //         mediaRecorder.start();

    //         console.log("Stream", stream);

    //         mediaRecorder.addEventListener('dataavailable', event => {
    //             console.log(event.data);
    //             setAudioChunks(prevChunks => [...prevChunks, event.data]);
    //         });
        
    //     })
    //     .catch(error => {
    //         console.log("Error in recording", error);
    //     })

    // }      

    // const stopRecording = () => {
    //     if(mediaRecorder)
    //         mediaRecorder.stop();
        
    // }

    // useEffect(() => {
    //     if(isStart){
    //         startRecording();
    //         console.log("start");
    //     }
    // }, [isStart])

    useEffect(() => {
        let count = 0;
        count = counter - 0.100;
        if(count >= 0.00 && isStart){
            const timer = setInterval(() => {
                setCounter(count.toFixed(1));
            }, 100)
    
            return () => {
                clearInterval(timer);
            }
        }
    },[counter, isStart])
    // console.log(audioChunks);
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
                    <div className="audio-player-container"><audio src="" controls aria-disabled></audio></div>
                    <div className="record-audio-button-container">
                        <button className="record-audio-button" onClick={handleStart}>Start</button>
                        <button className="record-audio-button" onClick={handleStop}>Stop</button>
                        <button className="record-audio-button">Reset</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecordAudioComponent;