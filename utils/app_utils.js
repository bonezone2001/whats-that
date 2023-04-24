import { Ionicons, Feather, FontAwesome5, Entypo } from '@expo/vector-icons';
import { Platform } from "react-native"
import { Buffer } from 'buffer';

export const appUtils = {
    // https://github.com/software-mansion/react-native-reanimated/issues/3355
    // Seems like expo is using an older version of reanimated, but updating it makes expo complain about a version mismatch
    // So this is a temporary fix for a bug that doesn't affect the android app but breaks the web app
    fixReanimated() {
        if (Platform.OS === 'web')
            window._frameTimestamp = null
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
        library = library.toLowerCase();
        switch (library) {
            case "ionicons":
                return Ionicons;
            case "feather":
                return Feather;
            case "fa5":
                return FontAwesome5;
            case "entypo":
                return Entypo;
            default:
                return Ionicons;
        }
    },

    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    debounceLeading(func, wait) {
        let timeout;
        return function(...args) {
            if (!timeout) func.apply(this, args);
            clearTimeout(timeout);
            timeout = setTimeout(() => timeout = null, wait);
        };
    }
};