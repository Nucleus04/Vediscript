import { useEffect } from "react";

function useCountdown(setCounter, setIsStart, counter, isStart) {
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
        } {
            setIsStart(false);
        }
    },[counter, isStart])
}

export default useCountdown;