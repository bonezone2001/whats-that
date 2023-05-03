// Registration screen, presented when navigated to from login.

import {
    View,
    Text,
    ImageBackground,
    Dimensions,
    StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TextInput from '@components/shared/text_input';
import React, { useEffect, useState } from 'react';
import { entryStyle, globalStyle } from '@styles';
import Button from '@components/shared/button';
import { entryUtils } from '@utils';
import api from '@api';

// Since mobile doesn't support SVG, we need two versions of the background image
import bgImageMobile from '@assets/images/register_bg.png';
import bgImageWeb from '@assets/images/register_bg.svg';

export default function Login() {
    const [triggerValidation, setTriggerValidation] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [bgImage, setBgImage] = useState(bgImageMobile);
    const [majorError, setMajorError] = useState('');
    const [firstName, setFirstName] = useState('');
    const [loading, setLoading] = useState(false);
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const updateBgImage = () => entryUtils.updateBgImage(setBgImage, bgImageWeb, bgImageMobile);
        updateBgImage();
        const subscription = Dimensions.addEventListener('change', updateBgImage);
        return () => subscription.remove();
    }, []);

    // Reset trigger validation when it has chance to run
    useEffect(() => {
        if (triggerValidation) setTriggerValidation(false);
    }, [triggerValidation]);

    const handleRegister = async () => {
        setMajorError('');
        const errors = entryUtils.validateRegister(
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        );
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
            navigation.navigate('Login');
        } catch (error) {
            const errorMsg = error?.response.data?.split('-').splice(1).join('-').trim() || 'Something went wrong';
            setMajorError(errorMsg);
        }
        setLoading(false);
    };

    return (
        <ImageBackground source={bgImage} style={entryStyle.backgroundImage}>
            <View style={entryStyle.container}>
                {/* Title */}
                <Text style={entryStyle.title}>
                    Register
                </Text>

                {/* Login form */}
                <TextInput
                    label="First Name"
                    block={80}
                    value={firstName}
                    onChangeText={setFirstName}
                    forceValidation={triggerValidation}
                    validation={() => entryUtils.validateName(firstName)}
                    style={styles.formElement}
                />
                <TextInput
                    label="Last Name"
                    block={80}
                    value={lastName}
                    onChangeText={setLastName}
                    forceValidation={triggerValidation}
                    validation={() => entryUtils.validateName(lastName)}
                    style={styles.formElement}
                />
                <TextInput
                    contentType="email-address"
                    label="Email"
                    block={80}
                    value={email}
                    onChangeText={setEmail}
                    forceValidation={triggerValidation}
                    validation={() => entryUtils.validateEmail(email)}
                    style={styles.formElement}
                />
                <TextInput
                    label="Password"
                    block={80}
                    value={password}
                    onChangeText={setPassword}
                    forceValidation={triggerValidation}
                    validation={() => entryUtils.validatePassword(password)}
                    style={styles.formElement}
                    secureTextEntry
                />
                <TextInput
                    label="Confirm Password"
                    block={80}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    forceValidation={triggerValidation}
                    validation={() => entryUtils.validateConfirmPassword(password, confirmPassword)}
                    style={styles.formElement}
                    secureTextEntry
                />
                <Button
                    block={80}
                    onPress={handleRegister}
                    style={styles.formElement}
                    loading={loading}
                >
                    Login
                </Button>

                {/* Error text */}
                {
                    majorError
                        ? <Text style={globalStyle.infoText}>{majorError}</Text>
                        : null
                }

                {/* Navigate to register */}
                <Button
                    mode="text"
                    block={80}
                    href="Login"
                    style={styles.subtitle}
                >
                    Already have an account? Login
                </Button>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    formElement: {
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 12,
        color: '#555',
    },
});
