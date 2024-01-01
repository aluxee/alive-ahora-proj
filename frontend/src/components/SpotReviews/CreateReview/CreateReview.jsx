import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import { useState } from "react";
import { thunkCreateReview, thunkLoadAllReviews } from "../../../store/review";
import './CreateReview.css';
import { thunkReceiveSpot } from "../../../store/spot";

function CreateReview({ spotId }) {

	console.log("%c 🚀 ~ file: CreateReview.jsx:8 ~ CreateReview ~ spotId: ", "color: red; font-size: 25px", spotId)
	const dispatch = useDispatch();

	const user = useSelector(state => state.session.user)
	const currReviews = useSelector(state => state.reviews)
	const spot = useSelector(state => state.spots)


	const [stars, setStars] = useState('');
	const [review, setReview] = useState('');
	const [errors, setErrors] = useState({});

	const closeModal = useModal();

	const currUser = {
		id: user.id,
		firstName: user.firstName,
		lastName: user.lastName,
	}



	const handleSubmit = async (e) => {
		e.preventDefault();

		const errorsObject = {};

		if (!stars || stars === 0) errorsObject.stars = "Must have at least 1 star"
		if (review.length < 10) errorsObject.review = "Review must be at least 10 characters"
		if (user.id === spot.ownerId) errorsObject.errMessage = "Invalid post, same user"

		setErrors(errorsObject);

		const createReview = {
			userId: currUser.id,
			spotId: spotId,
			review: currReviews,
			stars
		}


		await dispatch(thunkCreateReview(spotId, currUser, createReview))



		setReview("")
		setStars(0)
		closeModal();

		dispatch(thunkLoadAllReviews(spotId))
		dispatch(thunkReceiveSpot(spotId))
	}



	return (
		<>
			<div className="outer-post-review">
				<div className="inner-post-review">
					<h2>How was your stay?</h2>

					{Object.values(errors).length === 0 && Object.values(errors).map((err, ind) =>
						<p key={ind} className="obj-err">{err}</p>

					)}
					<form className="review-form" onSubmit={handleSubmit}>
						<textarea name="user-review" id="user-review"
							cols="30" rows="10"
							maxLength={245}
							value={review}
							onChange={(e) => setReview(e.target.value)}

						></textarea>
						<div className="star-ratings-reviews">
							<ul className="star-reviews-container" style={{ listStyle: "none" }}>
								<li id="setStars-5" onMouseEnter={() => setStars(5)}>
									<i
										className={`fa fa-star ${stars >= 5 ? " filled" : " empty"}`}
									></i>
								</li>
								<li id="setStars-4" onMouseEnter={() => setStars(4)}>
									<i
										className={`fa fa-star ${stars >= 4 ? "filled" : "empty"}`}
									></i>
								</li>
								<li id="setStars-3" onMouseEnter={() => setStars(3)}>
									<i
										className={`fa fa-star ${stars >= 3 ? "filled" : "empty"}`}
									></i>
								</li>
								<li id="setStars-2" onMouseEnter={() => setStars(2)}>
									<i
										className={`fa fa-star ${stars >= 2 ? "filled" : "empty"}`}
									></i>
								</li>
								<li id="setStars-1" onMouseEnter={() => setStars(1)}>
									<i
										className={`fa fa-star ${stars >= 1 ? "filled" : "empty"}`}
									></i>
								</li>
								<div className="peek-a-boo" style={{ visibility: "hidden" }}>

								</div>
							</ul>
						</div>
						<button className="user-spot-review-submit" disabled={review.length < 10 || stars === ""}>Submit Your Review</button>
					</form>

				</div>
			</div>

		</>


	)

}


export default CreateReview;
