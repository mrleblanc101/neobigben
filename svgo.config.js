module.exports = {
    plugins: [
        { name: 'prefixIds' },
        { name: 'removeTitle' },
        { name: 'removeDesc' },
        { name: 'removeDimensions' },
        {
            name: 'removeAttrs',
            params: {
                attrs: '(fill|stroke)',
            },
        },
    ],
};
