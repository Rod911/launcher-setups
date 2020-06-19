const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model("Post");
const App = mongoose.model("Application");
const Draft = mongoose.model("Draft");
const verifyAuth = require('../middleware/verifyLogin');
const ObjectId = require('mongoose').Types.ObjectId;
const Axios = require('axios');


const isObjectIdValid = id => ObjectId.isValid(id) ? String(new ObjectId(id) === id) ? true : false : false;

router.get('/', async (req, res) => {
    try {
        const filter = {};
        const posts = await Post
            .find(filter)
            .select('title imgURL postedDate screenshots iconPack font')
            .populate('postedBy', 'username')
            .populate('iconPack', 'name appLink appIcon')
            .populate('widgets', 'name appLink appIcon')
            .sort('-postedDate');
        return res.json(posts);

    } catch (err) {
        return res.json(err);
    }
});

router.get('/u', (req, res) => {
    return res.status(400).json({
        error: "Missing parameters"
    });
});

router.get('/u/:user', async (req, res) => {
    try {
        const postedBy = req.params.user;
        if (isObjectIdValid(postedBy)) {
            const posts = await Post
                .find({ postedBy })
                .sort('-postedDate')
                .select('title imgURL postedDate')
            return res.json(posts);
        } else {
            return res.status(400).json({
                error: "Missing parameters"
            });
        }
    } catch (err) {
        return res.json(err);
    }
});

router.post('/add', verifyAuth, async (req, res) => {
    const launcher = 'bitpit.launcher';
    try {
        const { title, font, imgURL, iconPack, widgets } = req.body;
        if (!title || !imgURL) {
            return res.status(400).json({
                success: false,
                error: 'Fields Missing'
            });
        }
        const launcherID = await App.findOne({ packageName: launcher, appType: 'launcher' })
        if (!launcherID) return res.status(404).json({
            success: false,
            error: "Unknown Launcher"
        });

        const iconPackID = await App.findOne({ packageName: iconPack, appType: 'icon-pack' })
        if (!iconPackID) return res.status(404).json({
            success: false,
            error: "Unknown Icon Pack"
        });

        const widgetID = await App.findOne({ packageName: widgets, appType: 'widget' })
        if (!widgetID && widgets !== "") return res.status(404).json({
            success: false,
            error: "Unknown Widget"
        });

        const post = await Post.create({
            title,
            font,
            screenshots: imgURL,
            postedBy: req.user,
            launcher: launcherID,
            iconPack: iconPackID,
            widgets: widgetID,
        });

        await Draft.remove({ screenshot: imgURL });

        return res.status(201).json({
            success: true,
            data: post,
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            error: 'Server Error',
        });
    }
});

router.delete('/:postId', verifyAuth, async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findOne({ _id: postId });
        const removed = (post.postedBy == req.user._id) ? await post.remove() : false;
        const data = {
            public_ids: post.screenshots.map((screenshot) => screenshot.split('/')[screenshot.split('/').length - 1].split('.')[0])
        };
        // // console.log(); return;
        const url = `https://${process.env.CLOUDINARY_KEY}:${process.env.CLOUDINARY_SECRET}@api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/resources/image/upload/`;

        if (removed) {
            console.log(data)
            const res = await Axios.delete(url, {
                data
            });
            return res.json(res.data);
        }
        return res.status(500).json({
            success: false,
            err: 'Unknown'
        })
        // console.log(res);
        // delRequest.end();

    } catch (err) {
        // console.log(err)
        return res.json(err);
    }
});

router.get('/draft', verifyAuth, async (req, res) => {
    try {
        const postedBy = req.user;
        const drafts = await Draft.find({ postedBy });
        return res.json({
            success: true, drafts
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: "Server Error",
        });
    }
});

router.post('/draft', verifyAuth, async (req, res) => {
    try {
        const { screenshot } = req.body;
        if (!screenshot) return res.status(401).json({ success: false, error: "Missing URL" });
        const draft = await Draft.create({
            screenshot,
            postedBy: req.user,
        });
        return res.status(201).json({
            success: true,
            data: draft,
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            error: 'Server Error',
        })
    }
});

// Todo
router.delete('/draft', verifyAuth, async (req, res) => {
    try {
        const { screenshot } = req.body;
        if (!screenshot) return res.status(400).json({ success: false, error: "Missing file name" });
        // const removed = await Draft.deleteOne({ screenshot });
        const data = {
            public_ids: [screenshot.split('/')[screenshot.split('/').length - 1].split('.')[0]]
        };
        const url = `https://${process.env.CLOUDINARY_KEY}:${process.env.CLOUDINARY_SECRET}@api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/resources/image/upload/`;

        const deleted = await Axios.delete(url, {
            data
        });
        console.log(deleted)
        // if (removed) {
        //     return res.status(201).json({
        //         success: true,
        //         data: removed,
        //     });
        // }
        return res.status(500).json({
            success: false,
            error: 'Server Error',
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            error: 'Server Error',
        });
    }
});

module.exports = router;