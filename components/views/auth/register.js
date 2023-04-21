import { Text, View, TouchableOpacity, ImageBackground, Dimensions } from "react-native";
import { globalStyle, entryStyle, colors } from "@styles";
import { useEffect, useState } from "react";
import { entryUtils } from "@utils";
import api from "@api";

import Button from "@components/shared/button";
import TextInput from "@components/shared/text_input";

// Since mobile doesn't support SVG, we need two versions of the background image
// Could have just used the png version for both, but I wanted svg for higher quality on web
import bgImageMobile from "@assets/images/register_bg.png";
import bgImageWeb from "@assets/images/register_bg.svg";

export default ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [triggerValidation, setTriggerValidation] = useState(false);
    const [bgImage, setBgImage] = useState(bgImageWeb);
    const [majorError, setMajorError] = useState("");

    // Auto adjust the background image based on the dimensions and platform
    useEffect(() => {
        entryUtils.updateBgImage(setBgImage, bgImageWeb, bgImageMobile);
        const subscription = Dimensions.addEventListener("change", () => entryUtils.updateBgImage(setBgImage, bgImageWeb, bgImageMobile));
        return () => subscription.remove();
    }, []);

    // Reset the trigger validation
    useEffect(() => {
        if (triggerValidation) setTriggerValidation(false);
    }, [triggerValidation]);
    
    const handleRegister = async () => {
        setMajorError("");
        const errors = entryUtils.validateRegister(firstName, lastName, email, password, confirmPassword);
        if (errors) {
            setTriggerValidation(true);
            return;
        }

        const fields = [firstName, lastName, email];
        const setFields = [setFirstName, setLastName, setEmail];
        fields.forEach((field, index) => setFields[index](field.trim()));

        setLoading(true);
        try {
            await api.register(firstName, lastName, email, password);
            navigation.navigate("Login");
        } catch (error) {
            const errorMsg = error?.response.data?.split("-").splice(1).join("-").trim() || "An unknown error occurred";
            setMajorError(errorMsg);
        }
        setLoading(false);
    };

    return (
        // Switch between the two background images based on the platform
        <ImageBackground source={bgImage}  style={entryStyle.backgroundImage}>
            <View style={[globalStyle.container, { backgroundColor: "transparent" }]}>
                <Text style={entryStyle.title}>Register</Text>

                {/* Input form */}
                <TextInput
                    placeholder="First Name"
                    block={80}
                    shape="rounded"
                    style={entryStyle.input}
                    textColor="black"
                    value={firstName}
                    onChangeText={setFirstName}
                    onValidate={() => entryUtils.validateName(firstName)}
                    triggerValidate={triggerValidation}
                />
                <TextInput
                    placeholder="Last Name"
                    block={80}
                    shape="rounded"
                    style={entryStyle.input}
                    textColor="black"
                    value={lastName}
                    onChangeText={setLastName}
                    onValidate={() => entryUtils.validateName(lastName)}
                    triggerValidate={triggerValidation}
                />
                <TextInput
                    placeholder="Email Address"
                    block={80}
                    shape="rounded"
                    type="email-address"
                    style={entryStyle.input}
                    textColor="black"
                    value={email}
                    onChangeText={setEmail}
                    onValidate={() => entryUtils.validateEmail(email)}
                    triggerValidate={triggerValidation}
                />
                <TextInput
                    placeholder="Password"
                    block={80}
                    shape="rounded"
                    type="password"
                    style={entryStyle.input}
                    textColor="black"
                    value={password}
                    onChangeText={setPassword}
                    onValidate={() => entryUtils.validatePassword(password)}
                    triggerValidate={triggerValidation}
                />
                <TextInput
                    placeholder="Confirm Password"
                    block={80}
                    shape="rounded"
                    type="password"
                    style={entryStyle.input}
                    textColor="black"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onValidate={() => entryUtils.validateConfirmPassword(password, confirmPassword)}
                    triggerValidate={triggerValidation}
                />
                <Button
                    type="primary"
                    block={80}
                    onPress={handleRegister}
                    loading={loading}
                    shape="rounded"
                    textColor="black"
                >
                CREATE ACCOUNT
                </Button>
                {
                    majorError ?
                    <Text style={entryStyle.errorText}>{majorError}</Text>
                    : null
                }

                {/* Switch to login screen */}
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={entryStyle.touchableText}>
                        Already have an account? <Text style={[entryStyle.touchableTextBold, {
                            color: colors.secondary
                        }]}>Login</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}