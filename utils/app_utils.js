import { Feather, Ionicons } from '@expo/vector-icons';
import { Platform } from "react-native"
import { Buffer } from 'buffer';

export const appUtils = {
    // https://github.com/software-mansion/react-native-reanimated/issues/3355
    // Seems like expo is using an older version of reanimated, but updating it makes expo complain about a version mismatch
    // So this is a temporary fix for a bug that doesn't affect the android app but breaks the web app
    fixReanimated: () => {
        if (Platform.OS === 'web')
            window._frameTimestamp = null
    },

    // Make sure icons are loaded before using them (prevent boxy icons)
    loadIcons: async () => {
        await Promise.allSettled([
            Ionicons.loadFont(),
            Feather.loadFont(),
        ]);
    },

    blobToDataUrl: async (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });
    },

    dataUrlToBuffer: (base64) => {
        const type = base64.split(';')[0].split(':')[1];
        const data = base64.split(',')[1];
        const buffer = Buffer.from(data, 'base64');
        return { buffer, type };
    },
}