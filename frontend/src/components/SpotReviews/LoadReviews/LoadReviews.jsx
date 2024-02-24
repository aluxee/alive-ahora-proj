import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkLoadAllReviews } from "../../../store/review";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";

import CreateReview from "../CreateReview/CreateReview";
import './LoadReviews.css';
import DeleteReview from "../RemoveReview/RemoveReview";

function LoadReviews({ ownerId }) {

	const dispatch = useDispatch();
	const { spotId } = useParams();
	const [showCreateReview, setShowCreateReview] = useState(false);
	// console.log("%c STATE FOR LOAD REVIEWS: ", "color: orange; font-size: 30px", useSelector(state => state))
	// console.log("%c 🚀 ~ file: LoadReviews.jsx:9 ~ LoadReviews ~ dispatch: ", "color: red; font-size: 25px", dispatch)
	const recurredUserId = useSelector(state => state.session.user?.id);

	// console.log("%c 🚀 ~ file: LoadReviews.jsx:12 ~ LoadReviews ~ user: ", "color: red; font-size: 25px", user)

	const reviewsObj = useSelector(state => state.reviews)
	// console.log("%c 🚀 ~ file: LoadReviews.jsx:16 ~ LoadReviews ~ reviewsObj: ", "color: blue; font-size: 25px", reviewsObj)


	const reviews = Object.values(reviewsObj);
	// console.log("%c 🚀 ~ file: LoadReviews.jsx:25 ~ LoadReviews ~ reviews: ", "color: blue; font-size: 25px", reviews)


	const currReview = reviews.find(review => review.userId === recurredUserId);
	console.log("%c 🚀 ~ file: LoadReviews.jsx:32 ~ LoadReviews ~ currReview: ", "color: cyan; font-size: 25px", currReview)



	useEffect(() => {

		dispatch(thunkLoadAllReviews(spotId))

	}, [dispatch, spotId, showCreateReview])


	if (!reviews) return null;






	function orderSorts(a, b) {
		return b.id - a.id
	}

	const year = date => {
		const newYrDate = new Date(date)

		return newYrDate.getFullYear();
	};

	const month = date => {
		const newMthDate = Date(date)
		const newDate = newMthDate.split(' ')
		// console.log("%c 🚀 ~ file: LoadReviews.jsx:44 ~ month ~ newDate: ", "color: red; font-size: 25px", newDate)
		return newDate[1]
	};
	const closeMenu = () => setShowCreateReview(false);

	return (
		<>


			<div className="reviews-outer-container">
				<div className="reviews-inner-container">
					<div className="loaded-reviews" key={spotId} >

						{(
							currReview === undefined &&
							ownerId !== recurredUserId
							&& recurredUserId !== undefined
						) ?
							<button className={'review-button'} id="review-button-loaded" >

								<OpenModalMenuItem
									itemText='Post Your Review'
									className='direct-post-review-button'
									style={{ width: "max-content" }}
									onItemClick={closeMenu}
									modalComponent={<CreateReview spotId={spotId} reviews={reviews} />}
								/>
							</button>
							:
							null
						}


						{reviews.sort(orderSorts).map(currReview => (
							<div key={currReview.id} className="key-review">

								<div className="review-post_section-one">
									<div className="user-rating">

										<h3>
											{/* {console.log("inside LoadReviews render...", currReview)} */}
											{currReview.User.firstName + " " + currReview.User.lastName}
										</h3>
										<div className="user-rating_stars">
											<i className="fa-solid fa-star" style={{ color: "gold" }}></i>
											{parseFloat(currReview.stars).toFixed(1)}
										</div>
									</div>
									<div className="user-date">
										<h4>
											{month(currReview.createdAt) + " " + year(currReview.createdAt)}
										</h4>
									</div>
								</div>
								<div id="review-commentary">
									{currReview.review}
								</div>
								<hr />
								{
									currReview.userId === recurredUserId ?
										<button className="curr-review-delete">
											<OpenModalMenuItem
												itemText='Delete'
												className='direct-delete-review-button'
												style={{ width: "max-content" }}
												onItemClick={closeMenu}
												modalComponent={<DeleteReview review={currReview} />}
											/>
										</button> : null
								}
							</div>
						))
						}
					</div>

				</div>
			</div>
		</>
	)

}


export default LoadReviews;
