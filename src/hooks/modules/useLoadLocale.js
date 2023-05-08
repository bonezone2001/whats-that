// Hook to load all locales used within the app
// This is primarily used to prevent the app from loading without the locales
// Since loading is asynchronous

import { useEffect, useState } from 'react';
import { getLocale } from '@locales';

export const useLoadLocale = () => {
    const [isLocaleLoaded, setIsLocaleLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                await getLocale();
            } catch (error) {
                console.log(error);
            } finally {
                setIsLocaleLoaded(true);
            }
        })();
    }, []);

    return { isLocaleLoaded };
};
