import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';



function Navigation({ isLoaded }) {

	const sessionUser = useSelector((state) => state.session.user);


	let sessionLinks;
	if (sessionUser) {
		sessionLinks = (
			<li className='user_session_profile'>
				<ProfileButton user={sessionUser} />
			</li>
		);
	} else {
		sessionLinks = (
			<>
				<li className='session_login'>
					< OpenModalButton
						buttonText="Log In"
						modalComponent={<LoginFormModal />}
					/>
				</li>
				<li className='session_logout'>
					< OpenModalButton
						buttonText="Sign Up"
						modalComponent={<SignupFormModal />}
					/>
				</li>
			</>
		);
	}
	return (

		<ul className='nav_bar'>
			<li>
				<NavLink to='/'>Home</NavLink>
			</li>
			{isLoaded && sessionLinks}
		</ul>

	);
}

export default Navigation;
