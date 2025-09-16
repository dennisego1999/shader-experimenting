import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import pluginJs from '@eslint/js';
import tsEslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';
import { defineConfigWithVueTs, configureVueProject } from '@vue/eslint-config-typescript';

configureVueProject({
	tsSyntaxInTemplates: true,
	scriptLangs: ['ts', 'js', 'tsx', 'jsx'],
	rootDir: import.meta.dirname
});

export default defineConfigWithVueTs(
	// Globals
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			},
			parserOptions: {
				parser: tsEslint.parser
			}
		}
	},
	// Javascript
	pluginJs.configs.recommended,
	{
		rules: {
			'no-unused-vars': 'off',
			'no-undef': 'off'
		}
	},
	/// Typescript
	...tsEslint.configs.recommended,
	{
		rules: {
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-explicit-any': 'warn'
		}
	},
	// Vue
	pluginVue.configs['flat/recommended'],
	{
		rules: {
			'prettier/prettier': [
				'warn',
				{
					singleQuote: true,
					printWidth: 120,
					useTabs: true,
					bracketSameLine: false,
					trailingComma: 'none'
				}
			],
			'vue/multi-word-component-names': 'off',
			'vue/attribute-hyphenation': ['error', 'always'],
			'vue/no-v-html': 'off',
			'vue/v-on-event-hyphenation': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'no-async-promise-executor': 'off',
			'no-mixed-spaces-and-tabs': 0,
			indent: ['error', 'tab'],
			'linebreak-style': ['error', 'unix'],
			quotes: ['error', 'single'],
			semi: ['error', 'always'],
			'vue/component-name-in-template-casing': [
				'error',
				'PascalCase',
				{
					registeredComponentsOnly: false,
					ignores: []
				}
			],
			'vue/html-self-closing': [
				'error',
				{
					html: { void: 'any', normal: 'always', component: 'always' },
					svg: 'always',
					math: 'always'
				}
			],
			'vue/html-quotes': ['error', 'double', { avoidEscape: false }],
			'vue/multiline-html-element-content-newline': [
				'error',
				{
					ignoreWhenEmpty: true,
					ignores: ['pre', 'textarea'],
					allowEmptyLines: false
				}
			],
			'vue/prop-name-casing': ['error', 'camelCase'],
			'vue/v-bind-style': ['error', 'shorthand']
		}
	},
	{
		ignores: ['node_modules', '.nuxt', '.output', 'dist']
	},
	// Prettier
	prettier,
	{
		rules: {
			'prettier/prettier': [
				'error',
				{
					printWidth: 120,
					useTabs: true,
					singleQuote: true,
					bracketSameLine: false,
					trailingComma: 'none'
				}
			]
		}
	}
);
