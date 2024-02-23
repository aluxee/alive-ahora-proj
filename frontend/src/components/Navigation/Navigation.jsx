import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import MenuButton from './MenuButton';



function Navigation({ isLoaded }) {

	const sessionUser = useSelector((state) => state.session.user);
	const navigate = useNavigate();



	return (

		<ul className='nav_bar'>
			<div className='nav_name'
				style={{ cursor: "pointer" }}
				onClick={() => {
					navigate('/')
				}}
			>
				<div className='airbnb'>

					<h1 className='airbnb-h1'>
						<div className='clone-logo'>
							<i className="fa-solid fa-wand-sparkles"
								style={{ color: "red" }}
							/>
							starbnb
						</div>
					</h1>

				</div>
				<h3 id='alive-ahora' className='clone-logo'>star-ahora</h3>

			</div>
			<div className='nav_search'>
				<section>
					{/* insert search section */}
					{/* <i className="fa-regular fa-magnifying-glass"></i> */}
					{/* <i className="fa-solid fa-magnifying-glass"></i> */}
				</section>
			</div>
			<div>
				{
					sessionUser ?
						<Link to={`/spots/new`} className='nav_create-spot'>
							Create a New Spot
						</Link> : null
				}

			</div>
			<div className='nav_options' style={{ fontSize: 15 }}>
				<div className='content_nav_options'>
					<li className='nav_list' id='nav_house'>
						<MenuButton />
					</li>
					{isLoaded && (
						<li className='nav_list' id='nav_profile'>
							<ProfileButton user={sessionUser} />
						</li>
					)}
				</div>
			</div>
		</ul >

	);
}

export default Navigation;
