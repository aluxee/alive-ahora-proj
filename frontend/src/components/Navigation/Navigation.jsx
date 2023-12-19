import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';



function Navigation({ isLoaded }) {

	const sessionUser = useSelector((state) => state.session.user);


	return (

		<ul className='nav_bar'>
			<h1 className='airbnb'>airbnb</h1>
			<div className='nav_options'>
				<div className='content_nav_options'>
					<li className='nav_list' id='nav_house'>
						<NavLink exact to='/' className="house-icon">
							<i className="fa-solid fa-house" ></i>
						</NavLink>
					</li>
					{isLoaded && (
						<li className='nav_list' id='nav_profile'>
							<ProfileButton user={sessionUser} />
						</li>
					)}
				</div>
			</div>
		</ul>

	);
}

export default Navigation;
