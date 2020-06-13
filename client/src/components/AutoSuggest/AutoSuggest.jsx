/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import Autosuggest from 'react-autosuggest';

import './AutoSuggest.scss';

export default function AutoSuggest({ id, changeSelect, required }) {
	// const defaultIcon = 'https://cdn1.iconfinder.com/data/icons/flat-social/32/Social_social_google_play_store-64.png';
	const defaultSelectState = {
		icon: null,
		title: '',
		developer: '',
	};
	const [suggested, setSuggested] = useState('');
	const [suggestions, setSuggestions] = useState([]);
	const [suggestSelected, setSuggestSelected] = useState(false);
	const [selectedInfo, setSelectedInfo] = useState(defaultSelectState);

	const getSuggestions = async (value) => {
		const inputValue = value.trim().toLowerCase();
		const inputLength = inputValue.length;

		if (inputLength === 0) return [];

		const { data } = await Axios.get('/api/apps/search', {
			params: {
				search: value,
			},
		});
		return data;
	};

	const resetSelect = () => {
		setSuggestSelected(false);
		setSelectedInfo(defaultSelectState);
		changeSelect('');
		setSuggested('');
	};

	const renderInputComponent = (inputProps) => (
		<div className={`selected-wrapper${suggestSelected ? ' selected' : ''}`}>
			<div className="selected-container">
				<div className="selected-icon">
					<img src={selectedInfo.icon} alt="" />
				</div>
				<div className="selected-info">
					<p className="selected-title">{selectedInfo.title}</p>
					<p className="selected-developer">{selectedInfo.developer}</p>
				</div>
				<button type="button" className="reset-select" aria-label="Clear selection" onClick={resetSelect}><i className="ri-close-line" /></button>
			</div>
			<input {...inputProps} />
		</div>
	);

	// eslint-disable-next-line react/prop-types
	const renderSuggestionsContainer = ({ containerProps, children }) => (
		<div {...containerProps}>
			{children}
			<div className="react-autosuggest__footer">Selection required</div>
		</div>
	);

	// Suggestion Clicked, return value = input value
	const getSuggestionValue = (suggestion) => {
		changeSelect(suggestion.appId);
		setSuggestSelected(true);
		setSelectedInfo({
			icon: suggestion.icon,
			title: suggestion.title,
			developer: suggestion.developer,
		});
		return suggestion.title;
	};

	// Suggested item
	const renderSuggestion = (suggestion) => (
		<div className="suggested">
			<div className="suggested-icon"><img src={suggestion.icon} alt={suggestion.title} /></div>
			<div className="suggested-info">
				<p className="suggested-title">{suggestion.title}</p>
				<p className="suggested-developer">{suggestion.developer}</p>
			</div>
		</div>
	);

	const fetchSuggestions = async ({ value }) => {
		setSuggestions(await getSuggestions(value));
	};

	const clearSuggest = () => {
		setSuggestions([]);
	};

	const inputChange = (event, { newValue }) => {
		setSuggested(newValue);
	};

	const onKeyDown = (e) => {
		switch (e.key) {
			case 'ArrowUp':
			case 'ArrowDown':
				e.preventDefault();
				setSuggested(suggested);
				console.log(e.key);
				break;
			default: break;
		}
	};

	const inputProps = {
		placeholder: 'Type to search...',
		value: suggested,
		onChange: inputChange,
		className: 'form-control',
		id,
		onKeyDown,
		type: 'search',
		required
	};

	return (
		<Autosuggest
			inputProps={inputProps}
			suggestions={suggestions}
			onSuggestionsFetchRequested={fetchSuggestions}
			renderSuggestion={renderSuggestion}
			onSuggestionsClearRequested={clearSuggest}
			getSuggestionValue={getSuggestionValue}
			// highlightFirstSuggestion
			renderSuggestionsContainer={renderSuggestionsContainer}
			renderInputComponent={renderInputComponent}
			onSuggestionSelected={(event, { method }) => {
				if (method === 'enter') {
					event.preventDefault();
				}
			}}
			shouldRenderSuggestions={() => true}
		/>
	);
}

AutoSuggest.propTypes = {
	id: PropTypes.string.isRequired,
	changeSelect: PropTypes.func.isRequired,
	required: PropTypes.bool,
};
