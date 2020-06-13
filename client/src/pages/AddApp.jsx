import React, { useState } from 'react';
import Axios from 'axios';
import { toast } from 'react-toastify';
import AutoSuggest from '../components/AutoSuggest/AutoSuggest';


export default function AddApp() {

	const successToast = () => (
		<div className="">
			<h3>App saved!</h3>
		</div>
	);

	const [appSelected, setAppSelected] = useState('');
	const [typeSelected, setTypeSelected] = useState('None')

	const submitForm = async (e) => {
		e.preventDefault();
		try {
			const res = await Axios.post('/api/apps/id', {
				id: appSelected,
				appType: typeSelected,
			});

			console.log(res.data)
			
			if (res.data.success) {
				toast.success(successToast);
				setAppSelected('');
				e.target.reset();
				setTypeSelected('None');
			}
		} catch (err) {
			console.log(err)
		}
	}
	return (
		<div className="page">
			<form className="user-form new-post" onSubmit={submitForm}>
				<div className="form-group">
					<label htmlFor="icon-select" className="form-label">Select App</label>
					<AutoSuggest
						id="icon-select"
						changeSelect={(appID) => { setAppSelected(appID); }}
						clearSelect={() => { setAppSelected(''); }}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="appType" className="form-label">App type</label>
					<select name="appType" id="appType" defaultValue={typeSelected} className="form-control" required onChange={(e) => setTypeSelected(e.target.value)}>
						<option value='None' hidden>None Selected</option>
						<option value="icon-pack">Icon Pack</option>
						<option value="widget">Widget</option>
						<option hidden value="launcher">Launcher</option>
					</select>
				</div>
				<input type="hidden" name="icon-pack" value={appSelected} required />
				<div className="form-group">
					<button type="submit" className="btn primary-btn">
						<i className="ri-send-plane-line" />
						Post
					</button>
				</div>
			</form>
		</div>
	)
}
