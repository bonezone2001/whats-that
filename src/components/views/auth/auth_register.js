// Registration screen, presented when navigated to from login.

import { View, Text, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TextInput from '@components/shared/text_input';
import React, { useEffect, useState } from 'react';
import { entryStyle, globalStyle } from '@styles';
import Button from '@components/shared/button';
import { useAuthBackground } from '@hooks';
import { entryUtils } from '@utils';
import { t } from '@locales';
import api from '@api';

// Since mobile doesn't support SVG, we need two versions of the background image
import bgImageMobile from '@assets/images/register_bg.png';
import bgImageWeb from '@assets/images/register_bg.svg';

export default function RegisterScreen() {
    const [triggerValidation, setTriggerValidation] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [majorError, setMajorError] = useState('');
    const [firstName, setFirstName] = useState('');
    const [loading, setLoading] = useState(false);
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigation = useNavigation();

    // Update background image on screen size change
    const { bgImage } = useAuthBackground(bgImageWeb, bgImageMobile);

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

        // Trim all fields in case of unnecessary whitespace
        const fields = [firstName, lastName, email];
        const setFields = [setFirstName, setLastName, setEmail];
        fields.forEach((field, index) => setFields[index](field.trim()));

        setLoading(true);
        try {
            await api.register(firstName, lastName, email, password);
            navigation.navigate('Login');
        } catch (error) {
            const errorMsg = error?.response.data?.split('-').splice(1).join('-').trim() || t('unknown_error');
            setMajorError(errorMsg);
        }
        setLoading(false);
    };

    return (
        <ImageBackground source={bgImage} style={entryStyle.backgroundImage}>
            <View style={entryStyle.container}>
                <Text style={entryStyle.title}>
                    {t('register')}
                </Text>

                <TextInput
                    label={t('first_name')}
                    value={firstName}
                    onChangeText={setFirstName}
                    forceValidation={triggerValidation}
                    validation={() => entryUtils.validateName(firstName)}
                    style={entryStyle.formElement}
                />
                <TextInput
                    label={t('last_name')}
                    value={lastName}
                    onChangeText={setLastName}
                    forceValidation={triggerValidation}
                    validation={() => entryUtils.validateName(lastName)}
                    style={entryStyle.formElement}
                />
                <TextInput
                    contentType="email-address"
                    label={t('email')}
                    value={email}
                    onChangeText={setEmail}
                    forceValidation={triggerValidation}
                    validation={() => entryUtils.validateEmail(email)}
                    style={entryStyle.formElement}
                />
                <TextInput
                    label={t('password')}
                    value={password}
                    onChangeText={setPassword}
                    forceValidation={triggerValidation}
                    validation={() => entryUtils.validatePassword(password)}
                    style={entryStyle.formElement}
                    secureTextEntry
                />
                <TextInput
                    label={t('confirm_password')}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    forceValidation={triggerValidation}
                    validation={() => entryUtils.validateConfirmPassword(password, confirmPassword)}
                    style={entryStyle.formElement}
                    secureTextEntry
                />
                <Button
                    onPress={handleRegister}
                    style={entryStyle.formElement}
                    loading={loading}
                >
                    {t('register')}
                </Button>

                {
                    majorError
                        ? <Text style={globalStyle.infoText}>{majorError}</Text>
                        : null
                }

                <Button
                    mode="text"
                    href="Login"
                    style={entryStyle.subtitle}
                >
                    {t('screens.auth.register.have_account')}
                </Button>
            </View>
        </ImageBackground>
    );
}
