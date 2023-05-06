// I only did the following locales to save on time:
// https://stackoverflow.com/questions/9711066/most-common-locales-for-worldwide-compatibility

import * as Localization from 'expo-localization';
import I18n from 'ex-react-native-i18n';

import br from '@locales/json/br';
import cn from '@locales/json/cn';
import de from '@locales/json/de';
import en from '@locales/json/en';
import es from '@locales/json/es';
import fr from '@locales/json/fr';
import it from '@locales/json/it';
import jp from '@locales/json/jp';
import ru from '@locales/json/ru';

I18n.fallbacks = true;
I18n.defaultLocale = 'en';
I18n.translations = {
    br,
    cn,
    de,
    en,
    es,
    fr,
    it,
    jp,
    ru,
};

export async function getLocale() {
    try {
        await I18n.initAsync();
        I18n.locale = Localization.locale.substring(0, 2);
    } catch (error) {
        console.log(error);
        I18n.locale = 'en';
    }
}

export function t(name) {
    return I18n.t(name);
}
