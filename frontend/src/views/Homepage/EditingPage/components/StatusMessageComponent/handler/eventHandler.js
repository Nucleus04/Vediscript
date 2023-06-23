import { setIsThereError } from "../../../../../../redux/EditingAction";
export const handleOkayButton = (dispatch) => {
    
    const error = {
        state: false,
        status:"",
        message: "",
    }
    dispatch(setIsThereError(error));
}