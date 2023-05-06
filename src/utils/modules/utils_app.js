// Utility functions for general use.

import {
    Ionicons,
    Feather,
    FontAwesome5,
    Entypo,
} from '@expo/vector-icons';
import { Platform } from 'react-native';
import { Buffer } from 'buffer';
import { t } from '@locales';

export const appUtils = {
    // https://github.com/software-mansion/react-native-reanimated/issues/3355
    // Temporary fix for an issue with expo and reanimated version mismatch
    // Expo uses an older version of reanimated, updating it causes expo to complain
    // This bug only affects the web app, android app is not affected
    fixReanimated() {
        // eslint-disable-next-line no-underscore-dangle
        if (Platform.OS === 'web') window._frameTimestamp = null;
    },

    // So long press can be used
    disableContextMenu() {
        if (Platform.OS === 'web') document.addEventListener('contextmenu', (e) => e.preventDefault());
    },

    async loadIcons() {
        await Promise.allSettled([
            Ionicons.loadFont(),
            Feather.loadFont(),
        ]);
    },

    async blobToDataUrl(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });
    },

    dataUriToBuffer(base64) {
        const type = base64.split(';')[0].split(':')[1];
        const data = base64.split(',')[1];
        const buffer = Buffer.from(data, 'base64');
        return { buffer, type };
    },

    getIconLibrary(library) {
        const libraries = {
            ionicons: Ionicons,
            feather: Feather,
            fa5: FontAwesome5,
            entypo: Entypo,
        };

        const lower = library.toLowerCase();
        return libraries[lower] || Ionicons;
    },

    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    debounceLeading(func, wait) {
        let timeout;
        return (...args) => {
            if (!timeout) func.apply(this, args);
            clearTimeout(timeout);
            timeout = setTimeout(() => { timeout = null; }, wait);
        };
    },

    getInfoCardData(user, contacts, chats) {
        return [
            {
                icon: 'mail',
                label: t('email'),
                value: user?.email || '',
            },
            {
                icon: 'people',
                label: t('contacts'),
                value: contacts?.length || 0,
            },
            {
                icon: 'chatbubbles',
                label: t('chats'),
                value: chats?.length || 0,
            },
        ];
    },

    getEntriesWithPrefix(obj, prefix) {
        const filteredKeys = Object.keys(obj).filter((key) => key.startsWith(prefix));
        const result = filteredKeys.reduce((res, key) => {
            res[key] = obj[key];
            return res;
        }, {});
        return result;
    },

    multilineTrim(str) {
        return str.split('\n').map((line) => line.trim()).join('\n');
    },
};
