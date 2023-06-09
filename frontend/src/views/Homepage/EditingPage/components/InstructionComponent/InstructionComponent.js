import { useEffect, useState } from "react";
import "./style.css";
import { useSelector } from "react-redux";
import constants from "../../../../../constant/constant";
function InstructionComponent () {
    const globalOperationState = useSelector((state) => state.operation);
    const [instruction, setInstruction] = useState("");
    const [showInstruction, setShowInstruction] = useState(false);
    const constant = constants();
    useEffect(() => {
        if(globalOperationState.isThereCurrentOperation.state === true) {
            setShowInstruction(true);
            if(globalOperationState.isThereCurrentOperation.operation === constant.operation.remove_audio) {
                setInstruction("Drag the words to be muted in the transcription box.");
            } 
            if(globalOperationState.isThereCurrentOperation.operation === constant.operation.replace_audio){
                setInstruction("Drag the words to be replace in the transcription box.");
            }
            if(globalOperationState.isThereCurrentOperation.operation === constant.operation.highligting){
                setInstruction("Drag the words you want to highlight in the transcription box.");
            }
            if(globalOperationState.isThereCurrentOperation.operation === constant.operation.insert_text){
                setInstruction("Select the word you want, text will insert next to it.");
            }
        } else {
            setShowInstruction(false);
        }
    }, [globalOperationState.isThereCurrentOperation]);
    return (
        <div className={`instruction-container ${showInstruction? "": "display-none"}`}>
            <p>Instruction: {instruction}</p>
        </div>
    )
}

export default InstructionComponent;