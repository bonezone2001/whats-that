// Set the navigation header in any screen

import { BackButton, HeaderTitle } from '@components/shared/headers';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';

export const useScreenHeader = ({
    left = <BackButton href="View" />,
    title,
    right,
    args = [],
}) => {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => left,
            headerTitle: () => (typeof title === 'string' ? <HeaderTitle title={title} /> : title),
            headerRight: () => right,
        });
    }, args || []);
};
