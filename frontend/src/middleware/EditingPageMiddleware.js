import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Protected from ".";
import EditingLayout from "../views/Homepage/EditingPage/Layout/editingPageLayout";

function EditingPageMiddleware () {
    const { projectId } = useParams();
    const getprojectDetail = localStorage.getItem("project-details");
    let projectDetail = {};
    if(getprojectDetail) {
        projectDetail = JSON.parse(getprojectDetail);
    }

    if (projectId === projectDetail._id) {
      return <Protected element={<EditingLayout />} />;
    } else {
      return <Navigate to={"/project-preview"} replace={true} />;
    }
}

export default EditingPageMiddleware;