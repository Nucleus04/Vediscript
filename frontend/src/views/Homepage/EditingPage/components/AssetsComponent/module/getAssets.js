 const getAssets = async(projectId, setAudioFiles, token) => {
    try {
        const response = await fetch(`http://localhost:5000/get-assets/${projectId}`, {
        headers:{
            Authorization: `Bearer ${token}`,
        },
        });
        if(response.ok){
            const data = await response.json()
            setAudioFiles(data.files);
        } else {
            console.log("Not get the assets");
        }
    } catch (error) {
        console.log(error);
    }
}

export default getAssets;