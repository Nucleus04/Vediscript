const unload = async() => {
    const history = JSON.parse(localStorage.getItem("history"));
    const projectDetail = JSON.parse(localStorage.getItem("project-details"));
    const body = {
        history: history,
        projectDetail: projectDetail,
    }
    fetch("http://localhost:5000/unload", {
    method: "POST",
    headers:{
        "Content-Type" : "application/json",
    },
    body: JSON.stringify(body),
    })
    localStorage.removeItem("history");
}


export default unload;