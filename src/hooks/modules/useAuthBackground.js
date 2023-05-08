// Change background image on mobile and web
// Make sure the background isn't occluding entry fields

import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { entryUtils } from '@utils';

export const useAuthBackground = (bgImageWeb, bgImageMobile) => {
    const [bgImage, setBgImage] = useState(bgImageMobile);

    useEffect(() => {
        const updateBgImage = () => entryUtils.updateBgImage(setBgImage, bgImageWeb, bgImageMobile);
        updateBgImage();
        const subscription = Dimensions.addEventListener('change', updateBgImage);
        return () => subscription.remove();
    }, []);

    return {
        bgImage,
        setBgImage,
    };
};
