// Bottom sheet displayed on profile page.
// Allows for logging out and accessing settings (NI).

import Button from '@components/shared/button';
import { globalStyle } from '@styles';
import { entryUtils } from '@utils';
import PropTypes from 'prop-types';
import { t } from '@locales';
import React from 'react';

export const settings = {
    parentRouteName: 'Profile',
    sheetPercent: 18,
};

export function sheet() {
    const handleLogout = async () => {
        entryUtils.logout().catch(console.log);
    };

    return (
        <>
            <Button
                mode="text"
                icon="settings"
                style={globalStyle.sheetButton}
            >
                {/* Settings */}
                {t('settings')}
            </Button>
            <Button
                mode="text"
                onPress={handleLogout}
                icon="log-out"
                style={globalStyle.sheetButton}
            >
                {/* Logout */}
                {t('logout')}
            </Button>
        </>
    );
}

sheet.propTypes = {
    route: PropTypes.object,
};
