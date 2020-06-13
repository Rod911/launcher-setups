/* eslint-disable no-underscore-dangle */
import React, { useState, useContext } from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import PostContext from "../context/postContext";

import moment from 'moment';

import './post.scss';
import Axios from 'axios';

const DeleteToast = ({ onConfirm, closeToast }) => {
	const handleConfirm = () => {
		onConfirm();
		closeToast();
	};

	return (
		<div className="d-flex justify-between align-center delete-toast">
			<h3>
				Are you sure?
				<small className="d-block">Click to dismiss</small>
			</h3> <button className="toast-btn" onClick={handleConfirm} >Confirm</button>
		</div>
	);
}

const Post = ({
	title, id, screenshots, ownerName, ownerId, postedDate, iconPack, widgets, font, deleteable
}) => {

	const { postDispatch } = useContext(PostContext);

	const confirmDelete = () => {

		toast.error(<DeleteToast onConfirm={async () => {
			await Axios.delete('/api/post/' + id);
			postDispatch({ payload: id, type: "DELETE" });
		}} />, {
			hideProgressBar: false,
			position: "bottom-right",
			closeButton: false,
			progressStyle: {
				transformOrigin: "right",
			}
		});
	}

	const dateVal = new Date(postedDate);
	const dateRel = moment(dateVal).fromNow();
	const [cardOpen, setCardOpen] = useState(false);
	return (
		<div className={`card${cardOpen ? ' open' : ''}`} tabIndex="0">
			<div className="setup-screenshot" onClick={() => setCardOpen(!cardOpen)}>
				<img src={screenshots[0]} alt={title} className="card-img" />
				<img src={screenshots[0]} alt={title} className="card-bg" />
			</div>
			<div className="post-extra">
				<div className="card-body">
					<p className="app-link"><span className="link-label" >Icons</span><a href={iconPack.appLink} target="_blank" rel="noopener noreferrer"><i className="ri-google-play-fill" />{iconPack.name}</a></p>
					<p className="app-link"><span className="link-label" >Widget</span>{widgets && <a href={widgets[0].appLink} target="_blank" rel="noopener noreferrer"><i className="ri-google-play-fill" />{widgets[0].name}</a>}{!widgets && <span className="text">None</span>}</p>
					<p className="app-link"><span className="link-label">Font</span>{font ? font : 'Default'}</p>
					<div className="actions">
						{
							deleteable && <button className="delete-btn" onClick={confirmDelete} arai-label="Delete Post" ><i className="ri-delete-bin-line"></i></button>
						}
					</div>
				</div>
			</div>
			<div className="card-body">
				<h3 className="card-title">{title}</h3>
				<p className="card-text posted-date">
					{`${dateRel} by `}
					<Link to={`/u/${ownerId}`}>{ownerName}</Link>
				</p>
				{/* <button className="btn like-btn" aria-label="Like" type="button">
					<i className="ri-heart-line ri-fw" post-id={id} />
				</button> */}
			</div>
		</div>
	);
};

const Home = ({ posts }) => {
	const currentUser = JSON.parse(localStorage.getItem('user')) || '';
	return (
		<div className="page">
			<div className="posts-wrapper">
				{
					posts.map(
						(post) => {
							const sameUser = post.postedBy._id === currentUser._id;
							return (
								<Post
									key={post._id}
									id={post._id}
									title={post.title}
									screenshots={post.screenshots}
									ownerName={post.postedBy.username}
									ownerId={post.postedBy._id}
									postedDate={post.postedDate}
									iconPack={post.iconPack}
									widgets={post.widgets}
									font={post.font}
									deleteable={sameUser}
								/>
							)
						},
					)
				}
			</div>
		</div>
	);
};

export default Home;

Post.propTypes = {
	title: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	screenshots: PropTypes.array.isRequired,
	ownerName: PropTypes.string.isRequired,
	ownerId: PropTypes.string.isRequired,
	postedDate: PropTypes.string.isRequired,
	iconPack: PropTypes.object,
	widgets: PropTypes.array,
	font: PropTypes.string,
	deleteable: PropTypes.bool.isRequired,
};
