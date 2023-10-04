module.exports = {
    parser: '@typescript-eslint/parser',  // Specifies the ESLint parser for TypeScript
    extends: [
        'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from @typescript-eslint/eslint-plugin
    ],
    plugins: [
        '@typescript-eslint',
        'prettier',
    ],
    rules: {
        // Add custom rules here
        'prettier/prettier': 'error',
    },
};
