
const startRecording = async(setIsStart, audioChunks, setAudioURL, setStartButtonLabel, counter) => {
   
    let mediaRecorder;
    try {
        const getUserPermision =  await navigator.mediaDevices.getUserMedia({audio: true});

        if(getUserPermision) {
            mediaRecorder = new MediaRecorder(getUserPermision, {mimeType: "audio/webm"});
            console.log("started");
            mediaRecorder.start();

            mediaRecorder.addEventListener("start", () => {
                setIsStart(true);
                
            })

            const dataPromise = new Promise((resolve) => {
                mediaRecorder.ondataavailable = (event) => {
                console.log("------", event.data);
                audioChunks.push(event.data); // Add data to audioChunks array
                }
                mediaRecorder.onstop= () => {
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
                setAudioURL(url);
                setStartButtonLabel("Submit")
            }, counter * 1000)
        }
    } catch (error) {
        console.log("There is error on recording video", error);
    }
}

export default startRecording;