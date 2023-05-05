// Hook to load data from API and put it into store
// Used primarily in App.js to load data before rendering the app

import { entryUtils, apiUtils, appUtils } from '@utils';
import Toast from 'react-native-toast-message';
import { useEffect, useState } from 'react';
import { useStore } from '@store';

export const useLoadApiData = () => {
    const store = useStore();
    const [isDataLoaded, setIsDataLoaded] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                if (await entryUtils.loadOrPurgeDeadToken()) {
                    await entryUtils.loadUserData();
                    apiUtils.updateChats();
                    apiUtils.updateContactsAndBlocked();
                }
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Could not load data',
                });
            }
            await appUtils.loadIcons();
            setIsDataLoaded(false);
        })();
    }, [store.token]);

    return { isDataLoaded };
};
