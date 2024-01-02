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



	const spots = Object.values(spotObj).filter(spot => spot.ownerId === user.id);
	console.log("%c spot (before):", "font-size: 25px; color: red", spots);




	const onClickSpot = (id) => {
		navigate(`/spots/${id}`)
	}


	useEffect(() => {
		console.log("%c Are we reaching our dispatch in our useEffect of currentSpots?", "color: yellow; font-size: 30px")

		dispatch(spotActions.thunkLoadCurrentSpots())


	}, [dispatch, showDeleteMenu])


	const closeMenu = () => setShowDeleteMenu(false);
	if (!spots) return null;

	const createSpot = (e) => {
		e.preventDefault();

		navigate('/spots/new');
	}

	return (
		<>
			<div className="current-spots-outside-container">
				<div className="current-spots-inside-container">
					<div className="current-spots-section" style={{ maxWidth: 1000 }}>
						<div className="current-spots-top">
							<h1>Manage Spots</h1>
							<button className="current-spots-create-spot-button curr-button"
								onClick={createSpot}
							>
								Create a New Spot
							</button>
						</div>
						<div className="each-current-spot">

							<ul className="current-spot_list">

								<>
									{
										spots.length !== 0 && spots !== undefined &&
										spots.map(spot => (
											<div className="current-spot_item" key={spot.id}>

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
													}
														onClick={() => onClickSpot(spot.id)}
													/>
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
													{/* <span></span> */}
												</div>
												<div className="current-spot-management-buttons">
													<button className="curr-button" id="current-spot-update" onClick={() => navigate(`/spots/${spot.id}/edit`)}>Update</button>
													<button className="curr-button"
														ref={ulRef}
														id="current-spot-delete">
														<OpenModalMenuItem itemText="Delete"
															onItemClick={closeMenu}
															modalComponent={
																<RemoveSpot
																	id={spot.id}

																	spot={spot} />
															}

														/>
													</button>
												</div>
											</div>
										))
									}

								</>
								{/* : null} */}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default CurrentSpots;
