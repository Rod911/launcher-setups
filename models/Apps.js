const mongoose = require('mongoose');

const AppSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	appLink: {
		type: String,
		validate: {
			validator: v => (v.trim().length > 0 || URLValidator.test(v)),
			message: 'Invalid URL',
		},
		required: true,
	},
	packageName: {
		type: String,
		unique: true,
		validate: {
			validator: v => (v.trim().length > 0 || PackageNameValidator.test(v)),
			message: 'Invalid Package name',
		},
		required: true,
	},
	appIcon: {
		type: String,
		validate: {
			validator: v => (v.trim().length > 0 || URLValidator.test(v)),
			message: 'Invalid URL'
		},
		required: true,
	},
	appType: {
		type: String,
		enum: [
			'icon-pack',
			'launcher',
			'widget',
		],
		required: true,
	}
});

mongoose.model('Application', AppSchema);

const PackageNameValidator = /^([a-z]{1}[a-z\d_]*\.)+[a-z][a-z\d_]*$/i;
const URLValidator = /(https?:\/\/(?:www\.|(?!www))[a-z0-9][a-z0-9-]+[a-z0-9]\.[^\s]{2,}|www\.[a-z0-9][a-z0-9-]+[a-z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-z0-9]+\.[^\s]{2,}|www\.[a-z0-9]+\.[^\s]{2,})/i;
