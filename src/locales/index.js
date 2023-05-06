// I only did the following locales to save on time:
// https://stackoverflow.com/questions/9711066/most-common-locales-for-worldwide-compatibility

import * as Localization from 'expo-localization';
import I18n from 'ex-react-native-i18n';

import en from '@locales/json/en';

I18n.fallbacks = true;
I18n.defaultLocale = 'en';
I18n.translations = {
    en,
};

export function getLocale() {
    try {
        const choice = Localization.locale;
        I18n.locale = choice.substring(0, 2);
        I18n.initAsync();
    } catch (error) {
        console.log('Failed to get locale, defaulting to en');
        I18n.locale = 'en';
    }
}

export function t(name) {
    return I18n.t(name);
}
