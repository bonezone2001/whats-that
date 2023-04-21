import { Platform } from "react-native"

export const appUtils = {
    // https://github.com/software-mansion/react-native-reanimated/issues/3355
    // Seems like expo is using an older version of reanimated, but updating it makes expo complain about a version mismatch
    // So this is a temporary fix for a bug that doesn't affect the android app but breaks the web app
    fixReanimated: () => {
        if (Platform.OS === 'web')
            window._frameTimestamp = null
    },

}