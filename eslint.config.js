import astro from 'eslint-plugin-astro'
import typescriptParser from '@typescript-eslint/parser'

export default [
	{
		ignores: ['dist/**', 'node_modules/**', '.github/**', '.changeset/**']
	},
	...astro.configs['flat/recommended'],
	{
		files: ['**/*.{js,ts}'],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				tsconfigRootDir: import.meta.dirname,
				sourceType: 'module',
				ecmaVersion: 'latest'
			}
		}
	},
	{
		files: ['**/*.astro'],
		languageOptions: {
			parserOptions: {
				parser: typescriptParser,
				extraFileExtensions: ['.astro']
			}
		},
		rules: {
			'astro/no-set-html-directive': 'error'
		}
	}
]
