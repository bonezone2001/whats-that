// Utility functions for general use.

import {
    Ionicons,
    Feather,
    FontAwesome5,
    Entypo,
} from '@expo/vector-icons';
import { Platform } from 'react-native';
import { Buffer } from 'buffer';

export const appUtils = {
    // https://github.com/software-mansion/react-native-reanimated/issues/3355
    // Temporary fix for an issue with expo and reanimated version mismatch
    // Expo uses an older version of reanimated, updating it causes expo to complain
    // This bug only affects the web app, android app is not affected
    fixReanimated() {
        // eslint-disable-next-line no-underscore-dangle
        if (Platform.OS === 'web') window._frameTimestamp = null;
    },

    // Remove web context menu so long press can be used
    disableContextMenu() {
        if (Platform.OS === 'web') document.addEventListener('contextmenu', (e) => e.preventDefault());
    },

    // Make sure icons are loaded before using them (prevent boxy icons)
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

    dataUrlToBuffer(base64) {
        const type = base64.split(';')[0].split(':')[1];
        const data = base64.split(',')[1];
        const buffer = Buffer.from(data, 'base64');
        return { buffer, type };
    },

    getIconLibrary(library) {
        const lower = library.toLowerCase();
        switch (lower) {
        case 'ionicons':
            return Ionicons;
        case 'feather':
            return Feather;
        case 'fa5':
            return FontAwesome5;
        case 'entypo':
            return Entypo;
        default:
            return Ionicons;
        }
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

    strToColor(str) {
        const hash = str.split('').reduce((acc, char) => {
            const newHash = (acc << 5) - acc + char.charCodeAt(0);
            return newHash & newHash;
        }, 0);

        let r = (hash & 0xFF0000) >> 16;
        let g = (hash & 0x00FF00) >> 8;
        let b = hash & 0x0000FF;

        const isGreyish = Math.abs(r - g) <= 32 && Math.abs(g - b) <= 32 && Math.abs(r - b) <= 32;
        const isBlack = r <= 32 && g <= 32 && b <= 32;

        if (isGreyish || isBlack) {
            r = Math.min(r + 64, 255);
            g = Math.min(g + 64, 255);
            b = Math.min(b + 64, 255);
        }

        const hexColor = `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
        return hexColor;
    },

    getInfoCardData(user, contacts, chats) {
        return [
            {
                icon: 'mail',
                label: 'Email',
                value: user?.email,
            },
            {
                icon: 'people',
                label: 'Friends',
                value: contacts?.length,
            },
            {
                icon: 'chatbubbles',
                label: 'Chats',
                value: chats?.length,
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
