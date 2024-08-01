module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'plugin:prettier/recommended', 'prettier'],
    plugins: ['vue', 'prettier'],
    // add your custom rules here
    rules: {
        'no-undef': 'off',
        'no-unused-vars': 'off',
        'no-console': 'warn',
        'vue/no-v-html': 'off',
        'vue/multi-word-component-names': 'off',
        'nuxt/no-cjs-in-config': 'off',
        'vue/html-button-has-type': 'error',
        'object-shorthand': ['error', 'always'],
        'vue/no-unused-components': 'warn',
        'vue/padding-line-between-blocks': ['error', 'always'],
        'vue/no-multiple-template-root': 'off',
        'vue/prop-name-casing': 'off',
        'no-irregular-whitespace': 'off',
        'vue/one-component-per-file': 'off',
        'vue/define-macros-order': [
            'error',
            {
                order: ['defineOptions', 'defineModel', 'defineProps', 'defineEmits', 'defineSlots'],
                defineExposeLast: true,
            },
        ],
    },
};
