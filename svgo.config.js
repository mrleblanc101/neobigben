module.exports = {
    plugins: [
        { name: 'prefixIds' },
        { name: 'removeTitle' },
        { name: 'removeDesc' },
        { name: 'removeViewBox', active: false },
        { name: 'removeDimensions' },
        {
            name: 'removeAttrs',
            params: {
                attrs: '(fill|stroke)',
            },
        },
    ],
};
