// Utility functions for the entry screens (login, register, etc.)
import { Dimensions, Platform } from "react-native";
import emailValidator from "email-validator";

export const entryUtils = {
    // Change bgImage based on the platform and dimensions
    updateBgImage(setBgImage, bgImageWeb, bgImageMobile) {
        const dimensions = Dimensions.get("window");
        if (dimensions.height < 600)
            setBgImage(null);
        else {
            if (Platform.OS === "web")
                setBgImage(bgImageWeb);
            else
                setBgImage(bgImageMobile);
        }
    },
    validateName(name) {
        if (name.length >= 3) return;
        return "Name too short";
    },
    validateEmail(email) {
        if (emailValidator.validate(email)) return;
        return "Invalid email address";
    },
    validatePassword(password) {
        const passwordRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        if (password.length == 0) return "Please enter a password";
        if (password.length < 8) return "Password too short";
        if (passwordRegex.test(password)) return;
        return "Password is not strong enough";
    },
    validateConfirmPassword(password, confirmPassword) {
        if (confirmPassword.length == 0) return "Please confirm your password";
        if (password == confirmPassword) return;
        return "Passwords do not match";
    },
    validateRegister(firstName, lastName, email, password, confirmPassword) {
        const errors = {
            firstName: entryUtils.validateName(firstName),
            lastName: entryUtils.validateName(lastName),
            email: entryUtils.validateEmail(email),
            password: entryUtils.validatePassword(password),
            confirmPassword: entryUtils.validateConfirmPassword(password, confirmPassword)
        };
        if (Object.values(errors).every(error => error == null)) return null;
        return errors;
    },
    validateLogin(email, password) {
        const emailError = entryUtils.validateEmail(email);
        const passwordError = password.length == 0 ? "Please enter a password" : null;
        if (emailError == null && passwordError == null) return null;
        return { email: emailError, password: passwordError };
    }  
};