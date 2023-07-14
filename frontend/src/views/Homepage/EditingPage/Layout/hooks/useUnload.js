import { useEffect } from "react";

function useUnload (projectDetail) {
    useEffect(() => {
        const handleUnload = async() => {
            try {
                const history = JSON.parse(localStorage.getItem("history"));
                const body = {
                    history: history,
                    projectDetail: projectDetail,
                    operation: "RELOAD",
                }
                await fetch("http://localhost:5000/unload", {
                method: "POST",
                headers:{
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify(body),
                })
                localStorage.removeItem("history");
            } catch (error) {
                console.log(error);
            }
        }
        window.addEventListener("beforeunload", handleUnload);
      
        return () => {
          window.removeEventListener("beforeunload", handleUnload);
        };
    }, []);
}

export default useUnload;