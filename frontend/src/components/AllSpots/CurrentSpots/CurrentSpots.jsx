import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as spotActions from "../../../store/spot";
import './CurrentSpots.css';
import RemoveSpot from "../RemoveSpot/RemoveSpot";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";



function CurrentSpots() {


	const navigate = useNavigate();
	const dispatch = useDispatch();
	const spotObj = useSelector(state => state.spots);
	const user = useSelector(state => state.session.user);
	const [showDeleteMenu, setShowDeleteMenu] = useState(false);
	const ulRef = useRef();


	console.log("🚀 ~ file: CurrentSpots.jsx:14 ~ CurrentSpots ~ spotObj:", spotObj);
	console.log("🚀 ~ file: CurrentSpots.jsx:14 ~ CurrentSpots ~ user:", user);


	const spots = Object.values(spotObj).filter(spot => spot.ownerId)
	console.log("%c spot (before):", "font-size: 25px; color: red", spots);

	const toggleMenu = (e) => {
		e.stopPropagation();

		setShowDeleteMenu(!showDeleteMenu);
		<RemoveSpot />
	}


	useEffect(() => {
		console.log("Are we reaching our dispatch in our useEffect of currentSpots?")
		dispatch(spotActions.thunkLoadCurrentSpots())

		if (!showDeleteMenu) return;

		// const closeMenu = (e) => {
		// 	console.log("🚀 ~ file: CurrentSpots.jsx:43 ~ closeMenu ~ closeMenu:", closeMenu)
		// 	if(!ulRef.current.contains(e.target)){
		// 		setShowDeleteMenu(false);
		// 	}
		// }

		// document.addEventListener('click', closeMenu);
		// console.log("🚀 ~ file: CurrentSpots.jsx:50 ~ useEffect ~ closeMenu: (inside add event listener)", closeMenu)

		// return () => document.removeEventListener('click', closeMenu);

	}, [dispatch, showDeleteMenu])

	const closeMenu = () => setShowDeleteMenu(false);


	return (
				<>
			<div className="current-spots-outside-container">
				<div className="current-spots-inside-container">
					<div className="current-spots-section" style={{ maxWidth: 1000 }}>
						<div className="current-spots-top">
							<h1>Manage Spots</h1>
							<button className="current-spots-create-spot-button curr-button"
								onClick={createSpot}>
								Create a New Spot
							</button>
						</div>
						<div className="each-current-spot">
							<ul className="current-spot_list">
								{spots.length &&
									spots.map(spot => (
										<div className="current-spot_item" key={spot.id}>

											<>
												<div className="current-spot_prev-img">
													<img src={spot.previewImage} alt={`preview-image of ${spot.name} posted by ${user.username}`} style={
														{
															paddingTop: 15,
															height: 225,
															width: 225,
															overflow: "hidden",
															objectFit: "cover",
															overflowClipMargin: "content-box",
															borderRadius: 30
														}
													} />
												</div>
												<div className="current-spot-name-rate">
													<span id="current-spot-state-city">{spot.state}, {spot.city}</span>
													<span id="current-spot-rating">
														<i className="fa-solid fa-star"></i>
														{spot.avgRating ? spot.avgRating : "NEW!"}
													</span>
												</div>
												<div className="current-spot-price">
													<span id="current-spot-price-id">${spot.price} / night</span>
													<span></span>
												</div>
												<div className="current-spot-management-buttons">
													<button className="curr-button" id="current-spot-update">Update</button>
													<button onClick={toggleMenu} className="curr-button"
														ref={ulRef}
														id="current-spot-delete">
														<OpenModalMenuItem itemText="Delete"
															onItemClick={closeMenu}
															modalComponent={<RemoveSpot id={spot.id} />}

														/>
													</button>
												</div>
											</>
										</div>
									))
								}
							</ul>
						</div>

					</div>
				</div>
			</div>
		</>
	)
}

export default CurrentSpots;
