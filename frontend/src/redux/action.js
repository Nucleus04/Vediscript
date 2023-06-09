export const setShowCreateProjectModal = (value) => {
    return {
        type: "SET_SHOW_CREATE_PROJECT_FORM",
        payload: value,
    };
};

export const setRetrieveProjectList = (value) => {
    return {
        type: "SET_RETRIEVE_PROJECT_LIST",
        payload: value,
    }
}
export const setISEditingProjectDetail = (value) => {
    return {
        type: "SET_IS_EDITING_PROJECT_DETAIL",
        payload: value,
    }
}
export const setEditingProjectDetailState = (value) => {
    return {
        type: "SET_EDITING_DETAIL_STATE",
        payload: value,
    }
}

