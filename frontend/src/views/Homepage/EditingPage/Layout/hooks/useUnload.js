import { useEffect } from "react";

function useUnload (projectDetail) {
    useEffect(() => {
        const handleUnload = async() => {
            const history = JSON.parse(localStorage.getItem("history"));
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
        window.addEventListener("beforeunload", handleUnload);
      
        return () => {
          window.removeEventListener("beforeunload", handleUnload);
        };
    }, []);
}

export default useUnload;