// Hook to load data from API and put it into store
// Used primarily in App.js to load data before rendering the app

import { entryUtils, apiUtils, appUtils } from '@utils';
import Toast from 'react-native-toast-message';
import { useEffect, useState } from 'react';
import { useStore } from '@store';
import { t } from '@locales';

export const useLoadAppData = () => {
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const store = useStore();

    useEffect(() => {
        (async () => {
            try {
                if (await entryUtils.loadOrPurgeDeadToken()) {
                    await entryUtils.loadUserData();
                    apiUtils.updateChats();
                    apiUtils.updateContactsAndBlocked();
                    entryUtils.loadDraftsFromStorage();
                }
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: t('error'),
                    text2: t('hooks.useLoadApiData.error'),
                });
            }
            await appUtils.loadIcons();
            setIsDataLoaded(true);
        })();
    }, [store.token]);

    return { isDataLoaded };
};
