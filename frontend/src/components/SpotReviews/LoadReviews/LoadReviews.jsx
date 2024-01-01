import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkLoadAllReviews } from "../../../store/review";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";

import CreateReview from "../CreateReview/CreateReview";
import './LoadReviews.css';

function LoadReviews({ ownerId }) {

	const dispatch = useDispatch();
	const { spotId } = useParams();
	const [showCreateReview, setShowCreateReview] = useState(false)
	console.log("%c STATE FOR LOAD REVIEWS: ", "color: orange; font-size: 30px", useSelector(state => state))
	console.log("%c 🚀 ~ file: LoadReviews.jsx:9 ~ LoadReviews ~ dispatch: ", "color: red; font-size: 25px", dispatch)
	const recurredUserId = useSelector(state => state.session.user?.id);

	// console.log("%c 🚀 ~ file: LoadReviews.jsx:12 ~ LoadReviews ~ user: ", "color: red; font-size: 25px", user)

	const reviewsObj = useSelector(state => state.reviews)
	console.log("%c 🚀 ~ file: LoadReviews.jsx:16 ~ LoadReviews ~ reviewsObj: ", "color: blue; font-size: 25px", reviewsObj)


	const reviews = Object.values(reviewsObj);
	console.log("%c 🚀 ~ file: LoadReviews.jsx:25 ~ LoadReviews ~ reviews: ", "color: blue; font-size: 25px", reviews)


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

						<button className="post-review-button" id="review-button-loaded" >
							{(

								currReview === undefined &&
								ownerId !== recurredUserId
								&& recurredUserId !== undefined
							) ?

								<OpenModalMenuItem
									itemText='Post Your Review'
									className='direct-post-button'
									style={{ width: "max-content" }}
									onItemClick={closeMenu}
									modalComponent={<CreateReview spotId={spotId} reviews={reviews} />}
								/>
								: null
							}
						</button>


						{reviews.sort(orderSorts).map(currReview => (
							<div key={currReview.id} className="key-review">

								<div className="review-post_section-one">
									<h3>
										{console.log("inside LoadReviews render...", currReview)}
										{currReview.User.firstName + " " + currReview.User.lastName}
									</h3>
									<h4>
										{month(currReview.createdAt) + " " + year(currReview.createdAt)}
									</h4>
								</div>
								<div id="review-commentary">
									{currReview.review}
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
