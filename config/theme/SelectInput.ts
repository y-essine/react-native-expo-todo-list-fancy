import { createStyle } from '@gluestack-style/react';

export const SelectInput = createStyle({
    _web: {
        w: '$full',
    },
    pointerEvents: 'none',
    flex: 1,
    h: '$full',
    color: '$textLight100',
    props: {
        placeholderTextColor: '$textLight900',
    },
    _dark: {
        color: '$textDark50',
        props: {
            placeholderTextColor: '$textDark400',
        },
    },
});
