import React, { useState, useRef, useEffect } from 'react';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import ImgLoader from '../components/ImgLoader/ImgLoader';
import AutoSuggest from '../components/AutoSuggest/AutoSuggest';

import './addPost.scss';

export default function AddPost({ uploaded }) {
	const [title, setTitle] = useState('');
	const [titleInvalid, setTitleInvalid] = useState(false);
	const [font, setFont] = useState('');
	const [imgURL, setImgURL] = useState('');
	const [imgUploaded, setImgUploaded] = useState(false);
	const [imgHeight, setImgHeight] = useState(0);
	const [iconSelected, setIconSelected] = useState('');
	const [widgetSelected, setWidgetSelected] = useState('');
	const [drafts, setDrafts] = useState([]);
	const history = useHistory();

	const imgForm = useRef();
	const postForm = useRef();
	const previewImg = useRef();

	const successToast = () => (
		<div className="">
			<h3>Setup uploaded!</h3>
		</div>
	);

	const unknownToast = () => (
		<div className="">
			<h4>Something went wrong!</h4>
			<p>Wanna try again?</p>
		</div>
	);

	const submitForm = async (e) => {
		e.preventDefault();
		if (!title) {
			setTitleInvalid(true);
			return false;
		}
		const token = localStorage.getItem('auth-token') || null;
		Axios.defaults.headers['auth-token'] = token;
		try {
			const res = await Axios.post('/api/post/add', {
				title,
				imgURL,
				font,
				iconPack: iconSelected,
				widgets: widgetSelected,
			});

			if (res.data.success) {
				toast.success(successToast);
				uploaded(res.data.data._id);
				history.push('/');
				return true;
			}
			toast.warning(unknownToast);
			return false;
		} catch (err) {
			toast.error(err.response.data.error);
		}
		return false;
	};

	const setHeight = (trueWidth, trueHeight) => {
		const availWidth = previewImg.current.clientWidth;
		const newHeight = Math.round(trueHeight * (availWidth / trueWidth));
		setImgHeight(newHeight);
	};

	const uploadComplete = async ({ secureUrl, width, height }, draft = false) => {
		await setImgUploaded(true);
		setImgURL(secureUrl);
		setHeight(width, height);
		if (!draft) {
			const token = localStorage.getItem('auth-token') || null;
			Axios.defaults.headers['auth-token'] = token;
			Axios.post('/api/post/draft', {
				screenshot: secureUrl,
			});
		}
	};

	// eslint-disable-next-line no-unused-vars
	const preload = () => {
		const upload = {
			access_mode: 'public',
			asset_id: '09977e050f731be8f6eadb3e1a63ac3a',
			bytes: 2370229,
			created_at: '2020-06-07T08:49:11Z',
			etag: '322983d486f6c8b702f575a5d10c1901',
			existing: false,
			format: 'png',
			height: 1280,
			original_filename: 'Screenshot_2020-05-04-10-43-36',
			placeholder: false,
			public_id: 'launcher-setups/screenshots/Screenshot_2020-05-04-10-43-36_rtrvsi',
			resource_type: 'image',
			secure_url: 'https://res.cloudinary.com/rod911/image/upload/v1591519751/launcher-setups/screenshots/Screenshot_2020-05-04-10-43-36_rtrvsi.png',
			signature: 'ceb39efad61399957b0347183a8e54fd5479f4f4',
			tags: [],
			type: 'upload',
			url: 'http://res.cloudinary.com/rod911/image/upload/v1591519751/launcher-setups/screenshots/Screenshot_2020-05-04-10-43-36_rtrvsi.png',
			version: 1591519751,
			version_id: '9cc90b4b6a59b8c253d1e6ff9757b414',
			width: 720,
		};
		uploadComplete({
			secureUrl: upload.secure_url,
			width: upload.width,
			height: upload.height,
		});
	};

	const loadDrafts = async () => {
		const token = localStorage.getItem('auth-token') || null;
		Axios.defaults.headers['auth-token'] = token;
		const res = await Axios.get('/api/post/draft');
		if (res.data.success) {
			setDrafts(res.data.drafts);
		}
	}

	useEffect(() => {
		// Load dummy data on init
		// Issue: Lack of dependency list causes crash after post submit. 
		// Reason: preload is called before page is updated and state is cleared for component
		// preoad is used only in development, therefore issue is non critical.
		// Skip `uploaded` function call in `submitForm` when in use, then reload to view uploaded post

		// preload();
	});

	useEffect(() => {
		loadDrafts();
	}, [])

	const PostImageInput = () => (
		<>
			<div className="form-group upload-form form-section" ref={imgForm}>
				<ImgLoader
					uploadComplete={uploadComplete}
				/>
			</div>
		</>
	);

	// const removeImg = async (screenshot) => {
	// 	try {
	// 		const removed = await Axios.delete('/api/post/draft', { screenshot });
	// 		if (removed.data.success) {
	// 			setDrafts(drafts.filter(draft => drafts.screenshot !== draft));
	// 		}
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// }

	const loadImg = (screenshot) => {

		const img = new Image();
		img.addEventListener("load", function () {
			uploadComplete({
				secureUrl: screenshot,
				width: this.naturalWidth,
				height: this.naturalHeight,
			}, true);
		});
		img.src = screenshot;

	}

	const Draft = ({ screenshot }) => (
		<div className="draft-preview">
			<img className="draft-img" src={screenshot} alt="" />
			<div className="draft-info">
				<div className="draft-options">
					{/* <button type="button" onClick={() => removeImg(screenshot)} aria-label="Remove"><i className="ri-close-line" /></button> */}
					<button type="button" onClick={() => loadImg(screenshot)} aria-label="Load"><i className="ri-gallery-upload-line" /></button>
				</div>
			</div>
		</div>
	);

	return (
		<div className="page">
			<form className={`new-post user-form ${imgUploaded ? 'complete' : ''}`} onSubmit={submitForm} ref={postForm}>
				<h3 className="form-head">Post a setup</h3>
				<div className="setup-info">
					<PostImageInput />
					<div className="post-info form-section">
						<div className="posted-preview">
							<div className="load-container">
								<div className="loader">Loading...</div>
							</div>
							<img src={imgURL} alt="" ref={previewImg} style={{ height: imgHeight }} />
						</div>
						<div className="form-fields">
							<div className={`form-group${titleInvalid ? ' invalid' : ''}`}>
								<label htmlFor="post-title" className="form-label">Title*</label>
								<input
									type="text"
									id="post-title"
									className="form-control"
									value={title}
									onChange={(e) => { setTitle(e.target.value); setTitleInvalid(false); }}
									required
								/>
							</div>
							<div className="form-group">
								<label htmlFor="post-font" className="form-label">Font Used</label>
								<input
									type="text"
									id="post-font"
									className="form-control"
									value={font}
									onChange={(e) => setFont(e.target.value)}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="icon-select" className="form-label">Icon Pack*</label>
								<AutoSuggest
									id="icon-select"
									changeSelect={(appID) => { setIconSelected(appID); }}
									clearSelect={() => { setIconSelected(''); }}
									required
								/>
							</div>
							<input type="hidden" name="icon-pack" value={iconSelected} />
							<div className="form-group">
								<label htmlFor="widget-select" className="form-label">Widget</label>
								<AutoSuggest
									id="widget-select"
									changeSelect={(appID) => { setWidgetSelected(appID); }}
									clearSelect={() => { setWidgetSelected(''); }}
								/>
							</div>
							<input type="hidden" name="widget" value={widgetSelected} />
							<div className="form-group">
								<button type="submit" className="btn primary-btn">
									<i className="ri-send-plane-line" />
									Post
								</button>
							</div>
						</div>
					</div>
					{
						drafts.length > 0 && (
							<div className="form-section drafts-section">
								<h3 className="form-head">Drafts</h3>
								{drafts.map(draft => <Draft screenshot={draft.screenshot} key={draft._id} />)}
							</div>
						)
					}
				</div>
			</form>
		</div>
	);
}
