const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const DraftSchema = mongoose.Schema({
	postedBy: {
		type: ObjectId,
		ref: "User",
		required: true,
	},
	screenshot: {
		type: String,
		required: true,
		validate: {
			validator: v => URLValidator.test(v),
			message: 'Invalid url',
		},
	}
});

mongoose.model('Draft', DraftSchema);

const URLValidator = /(https?:\/\/(?:www\.|(?!www))[a-z0-9][a-z0-9-]+[a-z0-9]\.[^\s]{2,}|www\.[a-z0-9][a-z0-9-]+[a-z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-z0-9]+\.[^\s]{2,}|www\.[a-z0-9]+\.[^\s]{2,})/i;
