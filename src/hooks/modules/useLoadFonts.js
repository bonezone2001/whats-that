// Load fonts used within the app

import { useFonts } from 'expo-font';

export const useLoadFonts = () => {
    // Android doesn't like variable fonts, so we have to use static fonts
    const [isFontLoaded] = useFonts({
        Montserrat_Regular: require('@assets/fonts/Montserrat/Montserrat-Regular.ttf'),
        Montserrat_Bold: require('@assets/fonts/Montserrat/Montserrat-Bold.ttf'),
    });

    return { isFontLoaded };
};
