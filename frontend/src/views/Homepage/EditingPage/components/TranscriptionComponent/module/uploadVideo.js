const UploadVideo = async(file) => {
    const formdata = new FormData();
    formdata.append("video", file);
    const token = localStorage.getItem("authToken");

    const response  = await fetch("http://localhost:5000/upload-video", {
        method: "POST",
        headers:{
            Authorization: `Bearer ${token}`,
        },
        body: formdata,
    })
    if (response.ok) {
        //const result = await response.json();
        console.log("Upload Successfully");
    } else {
        const result = await response.json();
        console.log("Theres a problem on uploading the file", result);
    }


}
export default UploadVideo;