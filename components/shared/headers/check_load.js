// Check or loading button for header.
// Displays a checkmark or a loading indicator in the header.

import Button from '@components/shared/button';
import PropTypes from 'prop-types';
import { colors } from '@styles';
import React from 'react';

export function CheckLoad({ loading, onPress, disabled }) {
    return (
        <Button
            mode="text"
            onPress={onPress}
            prefixSize={loading ? 34 : 38}
            prefixColor={colors.secondary}
            loading={loading}
            disabled={loading || disabled}
            icon="check"
        />
    );
}

CheckLoad.propTypes = {
    loading: PropTypes.bool,
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
};

CheckLoad.defaultProps = {
    loading: false,
    onPress: null,
    disabled: false,
};
