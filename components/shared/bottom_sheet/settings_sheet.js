import Button from '@components/shared/button';
import React from 'react';
import { entryUtils } from '@utils';
import { globalStyle } from '@styles';
import PropTypes from 'prop-types';

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
                Settings
            </Button>
            <Button
                mode="text"
                onPress={handleLogout}
                icon="log-out"
                style={globalStyle.sheetButton}
            >
                Logout
            </Button>
        </>
    );
}

sheet.propTypes = {
    route: PropTypes.object,
};
