import { Text, View, TouchableOpacity, ImageBackground, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyle, entryStyle, colors } from "@styles";
import TextInput from "@components/shared/text_input";
import Button from "@components/shared/button";
import { useEffect, useState } from "react";
import { entryUtils } from "@utils";
import { useStore } from "@store";
import api from "@api";

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
    const store = useStore();

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
        try {
            const reponse = await api.login(email, password);
            const { token, id } = reponse.data;
            await AsyncStorage.setItem("userId", id.toString());
            await store.setUserId(id);
            await AsyncStorage.setItem("token", token);
            await store.setToken(token);
            await entryUtils.loadUserData();
        } catch (error) {
            const errorMsg = error?.response?.data || "An unknown error occurred";
            setMajorError(errorMsg);
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
                    majorError ?
                    <Text style={globalStyle.errorText}>{majorError}</Text>
                    : null
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