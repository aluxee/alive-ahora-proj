// import { useState } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";

function ProfileButton({ user }) {
	const dispatch = useDispatch();

	const logout = (e) => {
		e.preventDefault();

		dispatch(sessionActions.logout())
	}

	return (
		<>
			<button style={{ fontSize: "15px", color: "red", borderStyle: "none", backgroundColor: "transparent" }}>
				< i className="fa-solid fa-user" />
			</button>
			<ul className="profile-dropdown">
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
