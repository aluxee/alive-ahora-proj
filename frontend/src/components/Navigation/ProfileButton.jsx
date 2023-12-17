import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";

function ProfileButton({ user }) {
	const dispatch = useDispatch();
	const [showMenu, setShowMenu] = useState(false);
	const ulRef = useRef();



	const ulClassName = "profile-dropdown" + (showMenu ? "" : "hidden")

	const toggleMenu = (e) => {
		e.stopPropagation();// Keep click from bubbling up to document and triggering closeMenu
		setShowMenu(!showMenu)
	}

	useEffect(() => {

		if (!showMenu) return;

		const closeMenu = (e) => {
			if (ulRef.current && !ulRef.current.contains(e.target)) {
				setShowMenu(false);
			}
		}

		document.addEventListener('click', closeMenu);

		return () => document.removeEventListener('click', closeMenu)
	}, [showMenu]);


	const logout = (e) => {
		e.preventDefault();

		dispatch(sessionActions.logout());
	}


	return (
		<>
			<button
				onClick={toggleMenu}
				className="button-profile-dropdown"
			>
				< i className="fa-solid fa-user" />
			</button>
			<ul className={ulClassName} ref={ulRef}>
				<li className="profile_dropdown_username">{user.username}</li>
				<li className="profile_dropdown_name">{user.firstName}{user.lastName}</li>
				<li className="profile_dropdown_email">{user.email}</li>
				<li className="profile_dropdown_logout">
					<button onClick={logout} className="user_logout_button">Log Out</button>
				</li>
			</ul>
		</>
	)
}



export default ProfileButton;
