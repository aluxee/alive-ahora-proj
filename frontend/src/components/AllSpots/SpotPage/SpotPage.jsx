import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { thunkReceiveSpot, thunkLoadSpotImages } from "../../../store/spot";
import SpotPageImages from "../SpotPageImages/SpotPageImages";
import LoadReviews from "../../SpotReviews/LoadReviews";
import CreateReview from "../../SpotReviews/CreateReview/CreateReview";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import './SpotPage.css';



function SpotPage() {

	const dispatch = useDispatch();
	const { spotId } = useParams();
	const [showCreateReview, setShowCreateReview] = useState(false);
	const [toSpot, setToSpot] = useState(); // useState causes re-render of your component if you call its setter with a new reference in memory.
	const spotObj = useSelector(state => state.spots);
	const userId = useSelector(state => state.session.user?.id)

	console.log("%c 🚀 ~ file: SpotPage.jsx:20 ~ SpotPage ~ userId: ", "color: pink; font-size: 25px", userId)
	const spot = spotObj[spotId];
	// const spotReview = spot[spotId];

	// console.log("%c 🚀 ~ file: SpotPage.jsx:19 ~ SpotPage ~ spot: ", "color: blue; font-size: 25px", spot)


	useEffect(() => {
		setToSpot(spotId)
		dispatch(thunkReceiveSpot(spotId))
		dispatch(thunkLoadSpotImages(spotId))

	}, [dispatch, toSpot, spotId, showCreateReview])

	if (Object.keys(spotObj).length === 0) {
		return null;
	}

	if (!spot || !spot.Owner) {
		return null
	}

	const closeMenu = () => setShowCreateReview(false);

	// console.log("🚀 %c ~ file: SpotPage.jsx:26 ~ SpotPage ~ spotObj:", "color: blue; font-size: 26px", spotObj,)

	// console.log("🚀 %c ~ file: SpotPage.jsx:8 ~ SpotPage ~ SPOT:", "color: pink; font-size: 25px", spot, spot.Owner); // spots is an array of objects; spot is an object


	const ownerObj = spot.Owner;

	// console.log("🚀 ~ file: SpotPage.jsx:26 ~ SpotPage ~ ownerObj:", ownerObj, ownerObj.firstName)

	return (
		<>
			<div className="outside-spot-page-container">
				<div className="inside-spot-page-container">
					<section id="spot-page-section" style={{ maxWidth: 1000 }}>


						<div className="spot-page_text-info">
							<h2>{spot.name}</h2>
							<h4>{spot.city}, {spot.state}, {spot.country}</h4>
						</div>
						<div className="spot-page_pics">
							<SpotPageImages key={spot.id} spot={spot} />
						</div>
						<div className="spot-page_part-two">
							<div className="spot-page_host">
								<h2>
									Hosted by {ownerObj.firstName} {ownerObj.lastName}
								</h2>
								<p>{spot.description}</p>
							</div>
							<div className="spot-page_price_and_reserve">
								<div className="price-reserve-inner">

									<div id="spot-page_price">
										<span>${spot.price} / night</span>
										<span></span>
									</div>
									<div id="spot-page_ratings_container">
										<span id="spot-page_rating" style={{ fontSize: 12 }}>
											<i className="fa-solid fa-star" style={{ color: "gold" }}></i>
											{spot.numReviews ?

												parseFloat(spot.avgRating).toFixed(1) + " " + '·' + " " + spot.numReviews + " " + 'Reviews'
												: 'New'
											}
										</span>
									</div>
									<button id="spot-page_button"

										onClick={() => alert("Feature coming soon!")}>reserve</button>
								</div>

							</div>
						</div>

						<hr />
						<div className="spot-page_reviews">
							{
								spot.numReviews === 0 ?
									<>
										<div className="no-reviews" >
											<div className="no-reviews_header" style={{}}>
												<h2>
													<i className="fa-solid fa-star"></i>
													New
												</h2>
											</div>
											<div className="no-reviews_comment">
												{
													spot.ownerId !== userId && userId ?
														<div>

															<button className={'review-button'} id="review-button-loaded" >

																<OpenModalMenuItem
																	itemText='Post Your Review'
																	className='direct-post-review-button'
																	style={{ width: "max-content" }}
																	onItemClick={closeMenu}
																	modalComponent={
																		<CreateReview
																			spotId={spotId}

																		/>}
																/>
															</button>
															Be the first to post a review!
														</div>
														:
														null
												}
											</div>
										</div>
									</>
									:
									<>
										<div className="post-reviews">
											<div className="reviews_header" style={{}}>
												<h2>
													<i className="fa-solid fa-star" style={{ color: "gold" }}></i>

													{
														spot.numReviews === 1 ?
															<>
																{parseFloat(spot.avgRating).toFixed(1) + " " + '·' + " " + spot.numReviews + " Review"}
															</> : <>
																{parseFloat(spot.avgRating).toFixed(1) + " " + '·' + " " + spot.numReviews + " Reviews"}
															</>
													}
												</h2>
											</div>
											<div className="reviews_section">
												<LoadReviews avgRating={spot.avgRating} numReviews={spot.numReviews} ownerId={spot.ownerId} reviews={spot.reviews} />
											</div>
										</div>
									</>
							}
						</div>
					</section>
				</div>
			</div>
		</>
	)
}


export default SpotPage;
