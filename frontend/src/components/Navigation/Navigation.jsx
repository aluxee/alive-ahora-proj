import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import * as sessionActions from '../../store/session';
import './Navigation.css';



function Navigation({ isLoaded }) {
	const dispatch = useDispatch();
	const sessionUser = useSelector((state) => state.session.user);

	const logout = (e) => {
		e.preventDefault();

		dispatch(sessionActions.logout());
	}

	const sessionLinks = sessionUser ? (
		<>
			<li className='user_session_profile'>
				<ProfileButton user={sessionUser} />
			</li>
			<li className='user_session_logout'>
				<button onClick={logout} >Log Out</button>
			</li>
		</>
	) : (
		<>
			<li className='session_login'>
				<NavLink to={'/login'}>Log In</NavLink>
			</li>
			<li className='session_logout'>
				<NavLink to={'/signup'}>Sign Up</NavLink>
			</li>
		</>
	);

	return (
		<>
			<ul className='nav_bar'>
				<li>
					<NavLink to='/'>Home</NavLink>
				</li>
				{isLoaded && sessionLinks}
			</ul>
		</>
	)
}

export default Navigation;
