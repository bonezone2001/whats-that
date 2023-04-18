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
        if (name.length < 3)
            return "Input too short";
        return null;
    },
    validateEmail(email) {
        if (!emailValidator.validate(email))
            return "Invalid email address";
        return null;
    },
    validatePassword(password) {
        const passwordRegex = /^(?=.[0-9])(?=.[A-Z])(?=.[!@#$%^&])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(password))
            return "Password is too weak";
        return null;
    },
    validateConfirmPassword(password, confirmPassword) {
        if (password !== confirmPassword)
            return "Passwords do not match";
        return null;
    }
};