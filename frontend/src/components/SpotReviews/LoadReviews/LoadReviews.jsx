import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkLoadAllReviews } from "../../../store/review";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import CreateReview from "../CreateReview/CreateReview";
import './LoadReviews.css';

function LoadReviews({ ownerId, avgRating, numReviews }) {

	const dispatch = useDispatch();
	const { spotId } = useParams();
	const [showCreateReview, setShowCreateReview] = useState(false)
	console.log("%c STATE FOR LOAD REVIEWS: ", "color: orange; font-size: 30px", useSelector(state => state))
	console.log("%c 🚀 ~ file: LoadReviews.jsx:9 ~ LoadReviews ~ dispatch: ", "color: red; font-size: 25px", dispatch)
	const recurredUserId = useSelector(state => state.session.user?.id);

	// console.log("%c 🚀 ~ file: LoadReviews.jsx:12 ~ LoadReviews ~ user: ", "color: red; font-size: 25px", user)

	const reviewsObj = useSelector(state => state.reviews)

	console.log("%c 🚀 ~ file: LoadReviews.jsx:16 ~ LoadReviews ~ reviewsObj: ", "color: red; font-size: 25px", reviewsObj)

	const reviews = Object.values(reviewsObj);

	console.log("%c 🚀 ~ file: LoadReviews.jsx:25 ~ LoadReviews ~ reviews: ", "color: red; font-size: 25px", reviews)

	useEffect(() => {

		dispatch(thunkLoadAllReviews(spotId))
	}, [dispatch, spotId])


	if (!reviews) return null;

	function orderSorts(a, b) {
		return b.id - a.id
	}
	const year = date => {

		const newYrDate = new Date(date)

		return newYrDate.getFullYear();
	}

	const month = date => {
		const newMthDate = Date(date)
		const newDate = newMthDate.split(' ')

		console.log("%c 🚀 ~ file: LoadReviews.jsx:44 ~ month ~ newDate: ", "color: red; font-size: 25px", newDate)
		return newDate[1]
	};
	const closeMenu = () => setShowCreateReview(false);

	// const createReviewOnClick = () => {
	// 	const reviewBeenPosted = reviews.find(review => review.userId === recurredUserId)

	// 	!reviewBeenPosted && ownerId !== recurredUserId && recurredUserId !== undefined ? (

	// 		<  >
	// 			<button className='post-review-button'>
	// 				<OpenModalMenuItem
	// 					itemText='Post Your Review'
	// 					onItemClick={closeMenu}
	// 					modalComponent={<CreateReview spotId={spotId} reviews={reviews} />}
	// 				/>
	// 			</button>

	// 		</>
	// 	) : null
	// };


	return (
		<>
			<div className="reviews-outer-container">
				<div className="reviews-inner-container">
					<div className="loaded-reviews" key={spotId} >

						<button className="post-review-button" id="review-button-loaded" style={{width: "max-content"}} >
							<OpenModalMenuItem
								itemText='Post Your Review'
								className='direct-post-button'
								style={{width: "max-content"}}
								onItemClick={closeMenu}
								modalComponent={<CreateReview spotId={spotId} reviews={reviews} />}

							/>


						</button>

						{reviews.sort(orderSorts).map(review => (
							<div key={review.id} className="key-review">
								<div className="review-post_section-one">
									<h3>
										{review.User.firstName + " " + review.User.lastName}
									</h3>
									<h4>
										{month(review.createdAt) + " " + year(review.createdAt)}
									</h4>
								</div>
								<div id="review-commentary">
									{review.review}
								</div>
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
