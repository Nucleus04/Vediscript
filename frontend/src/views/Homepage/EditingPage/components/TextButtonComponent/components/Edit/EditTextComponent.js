import { useDispatch } from "react-redux";
import { setIsThereCurrentOperation } from "../../../../../../../redux/OperationAction";
import constants from "../../../../../../../constant/constant";

function EditTextComponent () {
    const constant = constants();
    const dispatch = useDispatch();
    const handleClick = () => {
        dispatch(setIsThereCurrentOperation({state: true, operation: constant.operation.insert_text}))
    }

    return(
        <div className="text-edit-button" onClick={handleClick}>Insert</div>
    )
}
export default EditTextComponent;