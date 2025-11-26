const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const reactNativePlugin = require("eslint-plugin-react-native");

module.exports = defineConfig([
  // 1. Base Expo Config (Includes React, Hooks, TypeScript rules)
  expoConfig,

  // 2. Your Custom "Code Critic" Config
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],

    // Define plugins here so rules can find them
    plugins: {
      "react-native": reactNativePlugin,
      prettier: require("eslint-plugin-prettier"), // 👈 Add Prettier plugin
    },

    rules: {
      // --- THE "RATING" RULES (Code Quality) ---

      // 1. Cyclomatic Complexity: Forces smaller functions.
      complexity: ["warn", { max: 15 }],

      // 2. Nesting Depth: Warns if you nest blocks too deep.
      "max-depth": ["warn", 4],

      // 3. File Length: Warns if a file is over 350 lines.
      "max-lines": [
        "warn",
        { max: 350, skipBlankLines: true, skipComments: true },
      ],

      // 4. Function Arguments: Warns if a function takes too many arguments.
      "max-params": ["warn", 4],

      // --- REACT NATIVE SPECIFIC (Code Quality) ---

      // Flags unused styles in StyleSheet (Performance win)
      "react-native/no-unused-styles": "warn",

      // Flags inline styles (Code quality win)
      "react-native/no-inline-styles": "warn",

      // --- PRETTIER RULES ---

      // Runs Prettier and reports differences as ESLint errors
      "prettier/prettier": "error",
    },
  },
  {
    ignores: ["dist/*", "node_modules/*", "babel.config.js", "metro.config.js"],
  },

  // 3. PRETTIER CONFIG (Must be last to override styling rules)
  // This uses eslint-config-prettier to disable conflicting rules
  // and plugin:prettier/recommended which enables the plugin and sets the 'error' rule.
  require("eslint-config-prettier"), // 👈 Disables formatting rules in other configs
]);
