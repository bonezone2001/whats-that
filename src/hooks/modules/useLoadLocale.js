// Hook to load data from API and put it into store
// Used primarily in App.js to load data before rendering the app

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
