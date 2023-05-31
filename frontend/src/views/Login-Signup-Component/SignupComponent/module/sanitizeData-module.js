const validateInputData = (formData, confirmpassword) => {
    const errors = {
        name: "",
        email: "",
        password: "",
        confirmpassword: ""
    };

    const validationRules = {
        name: /^[a-zA-Z\s]+$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        confirmPassword: ''
    };

    if (formData.name && !validationRules.name.test(formData.name)) {
        errors.name = 'Please enter a valid name';
    }
    else {
        errors.name = "";
    }
    if (formData.email && !validationRules.email.test(formData.email)) {
        errors.email = 'Please enter a valid name';
    }
    else {
        errors.email = "";
    }
    if (formData.password && !validationRules.password.test(formData.password)) {
        errors.password = 'Please enter a valid password';
    }
    else {
        errors.password = "";
    }
    if (confirmpassword && confirmpassword != formData.password){
        errors.confirmpassword = 'Password does not match';
    }
    else {
        errors.confirmpassword = "";
    }

    return errors;
}

export default validateInputData;