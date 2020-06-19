import React, { useEffect, useReducer, useContext, useState } from 'react';
import { BrowserRouter, Route, useHistory } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Axios from 'axios';
import './App.scss';
import 'remixicon/fonts/remixicon.css';
import 'react-toastify/dist/ReactToastify.css';
import { reducer, initialState } from './context/userReducer';
import UserContext from './context/userContext';
import { postReducer, postsState } from './context/postReducer';
import PostContext from './context/postContext';

import Navbar from './components/Navbar';
import Header from './components/Header';

import Home from './pages/Home';
import AddPost from './pages/AddPost';
import Profile, { SignIn, SignUp } from './pages/Profile';
import AddApp from './pages/AddApp';

const environment = process.env.NODE_ENV;

const Routes = () => {
	const { userDispatch } = useContext(UserContext);
	const [uploaded, setUploaded] = useState('');
	const history = useHistory();

	useEffect(() => {
		const token = localStorage.getItem('auth-token');
		if (token) {
			Axios.defaults.headers['auth-token'] = token;
			if (environment === "development") {
				Axios.defaults.proxy = {
					host: 'localhost',
					port: 5000,
				}
			}
			userDispatch({
				type: 'USER',
				payload: token,
			});
		} else {
			history.push('/profile');
		}
	}, []);

	const [poststate, postDispatch] = useReducer(postReducer, postsState);

	useEffect(() => {
		async function fetch() {
			try {
				const postData = await Axios.get('/api/post');
				postDispatch({
					type: 'LOAD',
					payload: postData.data,
				});
			} catch (err) {
				console.log(err);
			}
		}
		fetch();
	}, [uploaded]);

	return (
		<div className="main-content">
			<PostContext.Provider value={{ poststate, postDispatch }}>
				<Route exact path="/">
					<Home posts={poststate} />
				</Route>
			</PostContext.Provider>
			<Route path="/new">
				<AddPost uploaded={setUploaded} />
			</Route>
			<Route exact path="/profile">
				<Profile />
			</Route>
			<Route path="/profile/signin">
				<SignIn />
			</Route>
			<Route path="/profile/signup">
				<SignUp />
			</Route>
			<Route path="/add-app">
				<AddApp />
			</Route>
		</div>
	);
};

function App() {
	const [userState, userDispatch] = useReducer(reducer, initialState);
	return (
		<UserContext.Provider value={{ userState, userDispatch }}>
			<main className="app">
				<BrowserRouter>
					<Header />
					<Navbar />
					<Routes />
					<ToastContainer />
				</BrowserRouter>
			</main>
		</UserContext.Provider>
	);
}

export default App;
