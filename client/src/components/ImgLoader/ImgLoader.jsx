import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import './ImgLoader.scss';
import Axios from 'axios';

export default function ImgLoader({ uploadComplete }) {
	const [file, setFile] = useState(null);
	const [fileName, setFileName] = useState('');
	const [fileValid, setFileValid] = useState(null);
	const [imgHeight, setImgHeight] = useState(0);

	const [uploadProgress, setUploadProgress] = useState(0);

	const [dragFile, setDragFile] = useState(false);

	const domIMG = useRef();
	const inputIMG = useRef();

	const acceptTypes = ['image/png', 'image/jpeg'];

	const updateImg = () => {
		const inputFile = inputIMG.current.files[0];
		if (inputFile) {
			if (!acceptTypes.includes(inputFile.type)) {
				setFile(null);
				setImgHeight(0);
				setFileName('');
				setFileValid(false);
				return;
			}
			setFileValid(true);
			const img = new Image();
			img.onload = () => {
				setImgHeight(domIMG.current.height);
				setFileName(inputFile.name);
			};
			img.src = URL.createObjectURL(inputFile);

			setFile(img.src);
		} else {
			setFile(null);
			setImgHeight(0);
			setFileName('');
			setFileValid(null);
		}
	};

	const clearImg = () => {
		inputIMG.current.value = '';
		updateImg();
	};

	const saveImg = async () => {
		try {
			const form = new FormData();
			// eslint-disable-next-line no-shadow
			const file = inputIMG.current.files[0];
			form.append('file', file);
			form.append('upload_preset', 'launcher-setups');
			form.append('cloud_name', 'rod911');
			// Cloudinary doesn't allow headers it doesn't use. Added later while submitting form
			delete Axios.defaults.headers['auth-token'];
			const config = {
				onUploadProgress: (progress) => {
					setUploadProgress(Math.round((progress.loaded / progress.total) * 100));
				},
			};
			const res = await Axios.post('https://api.cloudinary.com/v1_1/rod911/image/upload', form, config);
			if (res.status) {
				uploadComplete({
					secureUrl: res.data.secure_url,
					width: res.data.width,
					height: res.data.height,
				});
				console.log(res.data);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const dragOver = (e) => {
		e.preventDefault();
		setDragFile(true);
	};

	const dragLeave = (e) => {
		e.preventDefault();
		setDragFile(false);
	};

	const dragDrop = (e) => {
		e.preventDefault();
		const dropFile = e.dataTransfer.files;
		setDragFile(false);
		inputIMG.current.files = dropFile;
		updateImg();
	};

	return (
		<div
			className={`custom-file-select-wrapper ${fileValid === true ? 'file-valid' : (fileValid === false ? 'file-invalid' : '') + (dragFile ? ' file-dragged' : '')}`}
			onDragOver={dragOver}
			onDragLeave={dragLeave}
			onDrop={dragDrop}
		>
			<label className="custom-file-select">
				<input type="file" onChange={updateImg} style={{ display: 'none' }} accept={acceptTypes.join(',')} ref={inputIMG} />
				<span>Browse for an image</span>
			</label>
			<div className={`preview-wrapper ${file ? 'file-selected' : ''}`} style={{ height: imgHeight }}>
				<img src={file} className="preview-img" ref={domIMG} alt="" />
				<div className="preview-info">
					<p className="filename">{fileName}</p>
					<div className="preview-options">
						<button type="button" onClick={clearImg} aria-label="Reset"><i className="ri-close-line" /></button>
						<button type="button" onClick={saveImg} aria-label="Submit"><i className="ri-send-plane-2-line" /></button>
					</div>
				</div>
				<div className="upload-progress" style={{ width: `${uploadProgress}%` }} />
			</div>
		</div>
	);
}

ImgLoader.propTypes = {
	uploadComplete: PropTypes.func.isRequired,
};
