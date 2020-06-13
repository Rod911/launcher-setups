const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const App = mongoose.model("Application");
const verifyAuth = require('../middleware/verifyLogin');
const gplay = require('google-play-scraper').memoized();

const addApp = async ({ name, appLink, packageName, appIcon, appType }, res) => {
	try {
		const app = await App.create({ name, appLink, packageName, appIcon, appType });
		return res.status(201).json({
			success: true,
			data: app
		});
	} catch (err) {
		if (err.name === 'ValidationError') {
			const messages = Object.values(err.errors).map(val => val.message);

			return res.status(400).json({
				success: false,
				error: messages,
			});
		}
		if (err.code === 11000) {
			if (err.keyValue.hasOwnProperty('packageName')) return res.status(400).json({
				success: false,
				error: "Package name exists",
			});
		}

		console.log(err);

		return res.status(500).json({
			success: false,
			error: 'UNKNOWN',
		});
	}
}

router.get('/search', async (req, res) => {
	try {
		const { search } = req.query;
		if (search) {
			const results = await gplay.search({
				term: search,
				num: 7,
			});
			// Resize image
			return res.json(results.map((result) => {
				return {
					title: result.title,
					appId: result.appId,
					icon: result.icon,
					developer: result.developer,
					free: result.free,
					price: result.price,
					scoreText: result.scoreText,
				}
			}));
		}
		return res.json([]);
	} catch (err) {
		console.log(err)
	}
});

// router.post('/', verifyAuth, async (req, res) => {
// 	try {
// 		const { name, appLink, packageName, appType } = req.body;
// 		return res.json(await addApp({ name, appLink, packageName, appType }, res));
// 	} catch (err) {

// 	}
// });

router.post('/id', verifyAuth, async (req, res) => {
	try {
		const { id, appType } = req.body;
		const app = await gplay.app({ appId: id });
		return res.json(await addApp({
			name: app.title,
			appLink: app.url,
			packageName: app.appId,
			appIcon: app.icon,
			appType
		}, res));
	} catch (err) {

	}
})

module.exports = router;