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