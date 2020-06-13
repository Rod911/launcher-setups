const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    postedDate: {
        type: Date,
        default: Date.now(),
    },
    postedBy: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    launcher: {
        type: ObjectId,
        ref: "Application",
        required: true,
    },
    iconPack: {
        type: ObjectId,
        ref: "Application",
        required: true,
    },
    // wallpaper: {
    //     type: String,
    //     required: true,
    //     validate: {
    //         validator: v => URLValidator.test(v),
    //         message: 'Invalid url',
    //     },
    // },
    screenshots: {
        type: [String],
        required: true,
        validate: {
            validator: v => URLValidator.test(v),
            message: 'Invalid url',
        },
    },
    widgets: [{
        type: ObjectId,
        ref: "Application",
    }],
    font: String,
});

mongoose.model('Post', PostSchema);

const URLValidator = /(https?:\/\/(?:www\.|(?!www))[a-z0-9][a-z0-9-]+[a-z0-9]\.[^\s]{2,}|www\.[a-z0-9][a-z0-9-]+[a-z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-z0-9]+\.[^\s]{2,}|www\.[a-z0-9]+\.[^\s]{2,})/i;