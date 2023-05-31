class session {
    constructor () {
        this.token = localStorage.getItem("authToken");
        this.userData = localStorage.getItem("userData");
    }

    tokenCheck () {
        if(this.token){
            return true;
        } else {
            return false;
        }
    }
    userDataCheck () {
        if(this.userData) {
            return true;
        } else {
            return false;
        }
    }
  
}

export default session;