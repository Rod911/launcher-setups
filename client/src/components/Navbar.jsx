import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => (
	<nav className="navbar">
		<div className="nav-item">
			<NavLink className="nav-link" exact to="/" activeClassName="active">
				<i className="nav-icon ri-home-5-line ri-fw" />
				<span className="nav-text">Home</span>
			</NavLink>
		</div>
		<div className="nav-item">
			<NavLink className="nav-link" to="/new" activeClassName="active">
				<i className="nav-icon ri-add-circle-line ri-fw" />
				<span className="nav-text">Add</span>
			</NavLink>
		</div>
		<div className="nav-item">
			<NavLink className="nav-link" to="/search" activeClassName="active">
				<i className="nav-icon ri-search-2-line ri-fw" />
				<span className="nav-text">Search</span>
			</NavLink>
		</div>
		<div className="nav-item">
			<NavLink className="nav-link" to="/profile" activeClassName="active">
				<i className="nav-icon ri-user-3-line ri-fw" />
				<span className="nav-text">Profile</span>
			</NavLink>
		</div>
	</nav>
);

export default Navbar;
