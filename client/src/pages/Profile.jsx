import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import Axios from 'axios';
import { toast } from 'react-toastify';
import UserContext from '../context/userContext';

export const SignIn = () => {
	const { userDispatch } = useContext(UserContext);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const history = useHistory();

	const successToast = () => (
		<div className="">
			<h3>Signed in Successfully!</h3>
		</div>
	);

	const unknownToast = () => (
		<div className="">
			<h4>Something went wrong!</h4>
			<p>Wanna try again?</p>
		</div>
	);

	const credToast = () => (
		<div className="">
			<h4>Incorrect username or password</h4>
		</div>
	);

	const submitForm = async (e) => {
		e.preventDefault();
		try {
			const res = await Axios.post('/api/auth/signin', { username, password });

			if (res.data.success) {
				toast.success(successToast);
				const token = res.headers['auth-token'];
				localStorage.setItem('auth-token', token);
				localStorage.setItem('user', JSON.stringify(res.data.user));

				Axios.defaults.headers['auth-token'] = token;
				userDispatch({
					type: 'USER',
					payload: res.data.user,
				});
				history.push('/');
			} else {
				toast.warning(unknownToast);
			}
		} catch (err) {
			// console.log(err)
			if (err.response.data.error === 'CREDENTIALS') {
				toast.error(credToast);
			}
		}
	};

	return (
		<div className="page">
			<section className="user-form">
				<h2 className="form-head">Welcome Back!</h2>
				<p className="form-text">Let&apos;s get you signed in</p>
				<form className="account-form" onSubmit={submitForm}>
					<div className="form-group">
						<label htmlFor="login-username" className="form-label">Username</label>
						<input
							type="text"
							name="username"
							id="login-username"
							className="form-control"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Your cool username"
							autoComplete="current-username"
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="login-password" className="form-label">Password</label>
						<input
							type="password"
							name="password"
							id="login-password"
							className="form-control"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Your secret key"
							autoComplete="current-password"
							required
						/>
					</div>
					<div className="form-group">
						<button type="submit" className="btn primary-btn">Sign In</button>
					</div>
				</form>
				<p className="form-text">
					Create an account instead?
					<Link to="/profile/signup"> Sign up</Link>
				</p>
			</section>
		</div>
	);
};

export const SignUp = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const history = useHistory();

	const successToast = () => (
		<div className="">
			<h3>Your account has been created!</h3>
		</div>
	);

	const unknownToast = () => (
		<div className="">
			<h4>Something went wrong!</h4>
			<p>Wanna try again?</p>
		</div>
	);

	const userExistsToast = () => (
		<div className="">
			<h4>That username has already been used</h4>
			<p>
				<Link to="/profile/signin">Sign in</Link>
				if that&quot;s you
			</p>
		</div>
	);

	const emailExistsToast = () => (
		<div className="">
			<h4>That email has already been used</h4>
			<p>
				<Link to="/profile/signin">Sign in</Link>
				if that&quot;s you
			</p>
		</div>
	);


	const submitForm = async (e) => {
		e.preventDefault();
		try {
			const res = await Axios.post('/api/auth/signup', { username, email, password });

			if (res.data.success) {
				toast.success(successToast, {
					autoClose: false,
				});
				setUsername('');
				setPassword('');
				setUsername('');
				history.push('/profile/signin');
			} else {
				toast.warning(unknownToast);
			}
		} catch (err) {
			if (err.response.data.error === 'USERNAME_EXISTS') {
				toast.error(userExistsToast);
			}
			if (err.response.data.error === 'EMAIL_EXISTS') {
				toast.error(emailExistsToast);
			}
		}
	};

	return (
		<div className="page">
			<section className="user-form">
				<h2 className="form-head">Make your homescreens truly yours</h2>
				<form className="account-form" onSubmit={submitForm}>
					<div className="form-group">
						<label htmlFor="signup-username" className="form-label">Username</label>
						<input
							type="text"
							name="username"
							id="signup-username"
							className="form-control"
							value={username}
							onChange={(e) => { setUsername(e.target.value); }}
							placeholder="What do we call you?"
							autoComplete="new username"
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="signup-email" className="form-label">Email</label>
						<input
							type="email"
							name="email"
							id="signup-email"
							className="form-control"
							value={email}
							onChange={(e) => { setEmail(e.target.value); }}
							placeholder="How do we reach you?"
							autoComplete="email"
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="signup-password" className="form-label">Password</label>
						<input
							type="password"
							name="password"
							id="signup-password"
							className="form-control"
							value={password}
							onChange={(e) => { setPassword(e.target.value); }}
							placeholder="Try not to use '1234' or 'password'"
							autoComplete="new password"
							required
						/>
					</div>
					<div className="form-group">
						<button type="submit" className="btn primary-btn">Sign Up</button>
					</div>
				</form>
				<p className="form-text">
					Already have an account?
					<Link to="/profile/signin"> Sign in</Link>
				</p>
			</section>
		</div>
	);
};

const ProfilePage = ({ username }) => {
	const { userDispatch } = useContext(UserContext);

	const logout = () => {
		userDispatch({ type: 'LOGOUT' });
		localStorage.clear();
	};

	return (
		<div className="page">
			<div className="user-form">
				<div className="user-icon" />
				<h3 className="username">{username}</h3>
				<button
					className="btn primary-btn"
					type="button"
					onClick={logout}
				>
					Logout
				</button>
			</div>
		</div>
	);
};

const getUserData = async (id) => Axios.get('/api/auth/profile', { params: { userID: id } });

const Profile = () => {
	const { userState } = useContext(UserContext);
	const [username, setUsername] = useState('');

	useEffect(() => {
		if (userState) {
			const userData = getUserData(null);
			userData.then((res) => {
				setUsername(res.data.data.username);
			});
		}
	}, [userState]);

	if (userState) {
		return (
			<ProfilePage
				username={username}
			/>
		);
	}

	return (
		<div className="page">
			<section className="user-form">
				<h3 className="form-head">New here?</h3>
				<Link to="/profile/signup" className="btn primary-btn">Register</Link>
				<div className="form-divider" data-text="OR" />
				<h3 className="form-head">Already have an account?</h3>
				<Link to="/profile/signin" className="btn primary-btn">Sign in</Link>
			</section>
		</div>
	);
};

export default Profile;

ProfilePage.propTypes = {
	username: PropTypes.string.isRequired,
};
