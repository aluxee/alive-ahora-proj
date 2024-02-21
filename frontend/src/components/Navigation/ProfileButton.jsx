import { useState, useEffect, useRef } from "react";
import { useContext } from "react";
import { ButtonContext } from "../../context/ButtonContext";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';


// need for user? use context and use button context
function ProfileButton({ user }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const ulRef = useRef();
	const [showMenu, setShowMenu] = useState(false);
	const [hover, setHover] = useState(false);

	const onHover = () => {
		setHover(true)
	};

	const offHover = () => {
		setHover(!hover)
	}

	const hovering = (e) => {
		e.stopPropagation();

		offHover();
	}

	const toggleMenu = (e) => {
		e.stopPropagation();// Keep click from bubbling up to document and triggering closeMenu
		setShowMenu(!showMenu)
	}

	useEffect(() => {

		if (!showMenu) return;
		if (!hover) return;

		const closeMenu = (e) => {
			if (!ulRef.current.contains(e.target)) {
				setShowMenu(false);
			}
		}

		document.addEventListener('click', closeMenu);

		return () => document.removeEventListener('click', closeMenu)
	}, [showMenu, hover]);

	const closeMenu = () => setShowMenu(false);

	const logout = (e) => {
		e.preventDefault();

		dispatch(sessionActions.logout());
		closeMenu();
		navigate('/')
		alert("You have logged out.")
	}

	const manageSpots = (e) => {
		e.preventDefault();


		navigate('/spots/current');
		closeMenu();
	}
	const ulClassName = "profile-dropdown" + (showMenu ? "" : "hidden");
	const hoverClassName = "caption" + (hover ? "" : "hidden")
	return (
		<>
			<button
				onClick={toggleMenu}
				className="button-profile-dropdown"
			>

				< i className="fa-solid fa-user"
					onMouseOver={onHover}
					onMouseOut={hovering}
					role="button"

				/>
				{hover && <p className={hoverClassName + (showMenu ? (setHover(false)) : "")}>Profile</p>}
			</button>
			<ul className={ulClassName} ref={ulRef}>
				{user ? (
					<>

						<li className="profile_dropdown_name" style={{ fontFamily: "cursive" }}>Hello, {user.firstName}! </li>
						<li className="profile_dropdown_username">{user.username}</li>
						<li className="profile_dropdown_email">{user.email}</li>
						<hr className="hr-profile" />
						<li className="profile_dropdown_manage">
							<button onClick={manageSpots} className="user_manage_button">Manage Spots</button>
						</li>
						<hr className="hr-profile" />

						<li className="profile_dropdown_logout">
							<button onClick={logout} className="user_logout_button">Log Out</button>
						</li>
					</>
				) : (
					<>
						<OpenModalMenuItem itemText="Log In"
							onItemClick={closeMenu}
							modalComponent={<LoginFormModal />}
						/>
						<OpenModalMenuItem
							itemText="Sign Up"
							onItemClick={closeMenu}
							modalComponent={<SignupFormModal />}
						/>
					</>
				)}
			</ul>
		</>

	);
}



export default ProfileButton;
