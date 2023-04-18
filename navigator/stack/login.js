import { Text, View, TouchableOpacity, ImageBackground, Dimensions } from "react-native";
import { globalStyle, entryStyle, colors } from "@styles";
import { useEffect, useState } from "react";
import { entryUtils } from "@utils";
import { user } from "@api";

import Button from "@components/shared/button";
import TextInput from "@components/shared/text_input";

// Since mobile doesn't support SVG, we need two versions of the background image
// Could have just used the png version for both, but I wanted svg for higher quality on web
import bgImageMobile from "@assets/images/login_bg.png";
import bgImageWeb from "@assets/images/login_bg.svg";

export default ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [bgImage, setBgImage] = useState(bgImageWeb);
    const [majorError, setMajorError] = useState("");
    const [triggerValidation, setTriggerValidation] = useState(false);

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
    
    const handleLogin = async () => {
        setMajorError("");
        const errors = entryUtils.validateLogin(email, password);
        if (errors) {
            setTriggerValidation(true);
            return;
        }
        setEmail(email.trim());
        setLoading(true);
        const response = await user.login(email, password);
        if (response.status === 200) {
            
        } else {
            const error = (await response.text()) || "An unknown error occurred";
            setMajorError(error);
        }
        setLoading(false);
    };

    return (
        // Switch between the two background images based on the platform
        <ImageBackground source={bgImage} style={entryStyle.backgroundImage}>
            <View style={[globalStyle.container, { backgroundColor: "transparent" }]}>
                
                {/* Have whats and that be different colours */}
                <Text style={entryStyle.title}>
                    <Text style={{ color: colors.primary }}>Whats</Text>
                    <Text style={{ color: colors.secondary }}>That</Text>
                </Text>

                {/* Input form */}
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
                    onValidate={() => password.length === 0 ? "Password is required" : null}
                    triggerValidate={triggerValidation}
                />
                <Button
                    type="primary"
                    block={80}
                    onPress={handleLogin}
                    loading={loading}
                    shape="rounded"
                    textColor="black"
                >
                LOGIN
                </Button>
                {
                    majorError &&
                    <Text style={entryStyle.errorText}>{majorError}</Text>
                }

                {/* Switch to register screen */}
                <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                    <Text style={entryStyle.touchableText}>
                        Don't have an account? <Text style={entryStyle.touchableTextBold}>Register</Text>
                    </Text>
                </TouchableOpacity>
                
            </View>
        </ImageBackground>
    );
}