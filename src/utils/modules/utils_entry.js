// Utility functions for the entry screens (login, register, etc.)

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions, Platform } from 'react-native';
import emailValidator from 'email-validator';
import { useStore } from '@store';
import { t } from '@locales';
import api from '@api';

export const entryUtils = {
    // Change bgImage based on the platform and dimensions
    updateBgImage(setBgImage, bgImageWeb, bgImageMobile) {
        const dimensions = Dimensions.get('window');
        if (dimensions.height < 600) setBgImage(null);
        else if (Platform.OS === 'web') setBgImage(bgImageWeb);
        else setBgImage(bgImageMobile);
    },

    // Remove all non-alphanumeric characters and spaces (bad for localization, should be changed)
    sanitizeAndTrim(text) {
        return text.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    },

    // Remove all emojis and spaces
    sanitizeEmail(email) {
        return email.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]|[\\r])/g, '').replace(/\s/g, '').trim();
    },

    validateName(name) {
        if (name?.trim().length >= 3) return '';
        return t('utils.entry.name_too_short');
    },

    validateEmail(email) {
        if (emailValidator.validate(email?.trim())) return '';
        return t('utils.entry.invalid_email');
    },

    validatePassword(password) {
        const passwordRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        if (password?.length === 0) return t('utils.entry.enter_password');
        if (password?.length < 8) return t('utils.entry.password_too_short');
        if (passwordRegex.test(password)) return '';
        return t('utils.entry.password_weak');
    },

    validateConfirmPassword(password, confirmPassword) {
        if (confirmPassword?.length === 0) return t('utils.entry.confirm_password');
        if (password === confirmPassword) return '';
        return t('utils.entry.passwords_dont_match');
    },

    validateRegister(firstName, lastName, email, password, confirmPassword) {
        const errors = {
            firstName: entryUtils.validateName(firstName),
            lastName: entryUtils.validateName(lastName),
            email: entryUtils.validateEmail(email),
            password: entryUtils.validatePassword(password),
            confirmPassword: entryUtils.validateConfirmPassword(password, confirmPassword),
        };
        if (Object.values(errors).every((error) => !error)) return null;
        return errors;
    },

    validateLogin(email, password) {
        const emailError = entryUtils.validateEmail(email);
        const passwordError = password.length === 0 ? t('utils.entry.enter_password') : null;
        if (!emailError && !passwordError) return null;
        return { email: emailError, password: passwordError };
    },

    validateUpdateDetails(firstName, lastName, email, password, confirmPassword) {
        const errors = {
            firstName: entryUtils.validateName(firstName),
            lastName: entryUtils.validateName(lastName),
            email: entryUtils.validateEmail(email),
        };
        if (password?.length > 0 || confirmPassword?.length > 0) {
            errors.password = entryUtils.validatePassword(password);
            errors.confirmPassword = entryUtils.validateConfirmPassword(password, confirmPassword);
        }
        if (Object.values(errors).every((error) => !error)) return null;
        return errors;
    },

    // Test and load/destroy user token
    async loadOrPurgeDeadToken() {
        const store = useStore.getState();
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');

        try {
            if (token) {
                await api.testAuth(token);
                store.setUserId(parseInt(userId, 10));
                store.setToken(token);
                return true;
            }
        } catch (error) {
            if (error?.response?.status === 401) {
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('userId');
                store.setToken(null);
            } else {
                throw error;
            }
        }
        return false;
    },

    // Gather user data and put it in the store
    async loadUserData() {
        const store = useStore.getState();
        const userData = (await api.getUserInfo(store.userId)).data;
        const avatarData = await api.getUserPhoto(store.userId);
        userData.avatar = avatarData;
        store.setUser(userData);
    },

    async logout() {
        const store = useStore.getState();
        await api.logout();
        AsyncStorage.removeItem('userId');
        AsyncStorage.removeItem('token');
        store.setUserId(null);
        store.setToken(null);
    },
};
