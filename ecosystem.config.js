/**
* configuration for pm2 environment
**/

module.exports = {
	apps : [
		{
			name: "base-api",
			script: "./base-api.js",
			watch: true,
			env_qa: {
				"PORT": 8080,
				"NODE_ENV": "qa"
			},
			env_production: {
				"PORT": 8080,
				"NODE_ENV": "prod",
			}
		}
	]
}
