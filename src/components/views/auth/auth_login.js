// Login screen, presented when no token is present in storage.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ImageBackground } from 'react-native';
import { entryStyle, colors, globalStyle } from '@styles';
import TextInput from '@components/shared/text_input';
import React, { useEffect, useState } from 'react';
import Button from '@components/shared/button';
import { useAuthBackground } from '@hooks';
import { entryUtils } from '@utils';
import { useStore } from '@store';
import api from '@api';

// Since mobile doesn't support SVG, we need two versions of the background image
import bgImageMobile from '@assets/images/login_bg.png';
import bgImageWeb from '@assets/images/login_bg.svg';

export default function LoginScreen() {
    const [triggerValidation, setTriggerValidation] = useState(false);
    const [majorError, setMajorError] = useState('');
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const store = useStore();

    // Update background image on screen size change
    const { bgImage } = useAuthBackground(bgImageWeb, bgImageMobile);

    // Reset trigger validation when it has chance to run
    useEffect(() => {
        if (triggerValidation) setTriggerValidation(false);
    }, [triggerValidation]);

    const handleLogin = async () => {
        setMajorError('');
        const errors = entryUtils.validateLogin(email, password);
        if (errors) {
            setTriggerValidation(true);
            return;
        }
        setEmail(email.trim());
        setLoading(true);
        try {
            const response = await api.login(email, password);
            const { token, id } = response.data;
            await AsyncStorage.setItem('userId', id.toString());
            await store.setUserId(id);

            await AsyncStorage.setItem('token', token);
            await store.setToken(token);

            await entryUtils.loadUserData();
        } catch (error) {
            const errorMsg = error.response?.data || 'Something went wrong';
            setMajorError(errorMsg);
        }
        setLoading(false);
    };

    return (
        <ImageBackground source={bgImage} style={entryStyle.backgroundImage}>
            <View style={entryStyle.container}>
                <Text style={entryStyle.title}>
                    <Text style={{ color: colors.primary }}>Whats</Text>
                    <Text style={{ color: colors.secondary }}>That</Text>
                </Text>

                <TextInput
                    contentType="email-address"
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    forceValidation={triggerValidation}
                    validation={() => entryUtils.validateEmail(email)}
                    style={entryStyle.formElement}
                />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    forceValidation={triggerValidation}
                    validation={() => (password.length === 0 ? 'Password is required' : '')}
                    style={entryStyle.formElement}
                    secureTextEntry
                />
                <Button
                    onPress={handleLogin}
                    style={entryStyle.formElement}
                    loading={loading}
                >
                    Login
                </Button>

                {
                    majorError
                        ? <Text style={globalStyle.infoText}>{majorError}</Text>
                        : null
                }

                <Button
                    mode="text"
                    href="Register"
                    style={entryStyle.subtitle}
                >
                    Don&apos;t have an account? Register
                </Button>
            </View>
        </ImageBackground>
    );
}
