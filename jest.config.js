module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/**/*.test.ts', '**/test/**/*.test.ts'],
  moduleNameMapper: {
    '^@depts$': '<rootDir>/src/depts.ts',
    '^@envs$': '<rootDir>/src/envs.ts',
    '^@types$': '<rootDir>/src/types.ts',
    '^@u/(.*)$': '<rootDir>/src/u/$1'
  },
  reporters: [
			"default",
			[
				"@thesheps/jest-md-reporter",
				{
					"filename": "test-report.md",
					"publicPath": "./test-reports"
				}
			]
		]
};