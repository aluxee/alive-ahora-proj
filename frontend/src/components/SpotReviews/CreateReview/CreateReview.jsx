import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import { useState, useEffect } from "react";

import { thunkCreateReview, thunkLoadAllReviews } from "../../../store/review";
import './CreateReview.css';
import { thunkReceiveSpot } from "../../../store/spot";
import StarRatingInput from "./StarRatingInput";

function CreateReview({ spotId }) {

	// console.log("%c 🚀 ~ file: CreateReview.jsx:8 ~ CreateReview ~ spotId: ", "color: gold; font-size: 25px", spotId); //appears upon any enter of review info or hover over stars

	const dispatch = useDispatch();
	const currUser = useSelector(state => state.session.user)

	// console.log("%c 🚀 ~ file: CreateReview.jsx:19 ~ CreateReview ~ currReview: ", "color: red; font-size: 25px", currReview)
	const spot = useSelector(state => state.spots)


	const [stars, setStars] = useState('');
	const [review, setReview] = useState('');

	// console.log("%c 🚀 ~ file: CreateReview.jsx:26 ~ CreateReview ~ review: ", "color: red; font-size: 25px", review)

	const [errors, setErrors] = useState({});
	const [allow, setAllow] = useState(true);
	const [modalPop, setModalPop] = useState(false);

	const { closeModal } = useModal();

	const user = {
		id: currUser.id,
		firstName: currUser.firstName,
		lastName: currUser.lastName,
	}
	const toggleMenu = (e) => {
		e.stopPropagation();

		setModalPop(!modalPop);
	};

	useEffect(() => {
		const errorsObject = {};

		(!stars) ? errorsObject.stars = "Must have at least 1 star" && setAllow(true) : stars && setAllow(false);
		review.length < 10 ? (errorsObject.review = "Review must be at least 10 characters") && setAllow(true) : review.length && setAllow(false);
		currUser.id === spot.ownerId ? errorsObject.errMessage = "Invalid post, same user" : currUser.id;

		setErrors(errorsObject);


	}, [currUser.id, review.length, stars, setErrors, spot.ownerId])

	const onChange = num => {
		setStars(parseInt(num))
	}
	const closeMenu = () => setModalPop(false);

	const handleSubmit = async (e) => {
		e.preventDefault();


		const createReview = {
			userId: user.id,
			spotId,
			review,
			stars
		}


		// console.log("%c 🚀 ~ file: CreateReview.jsx:56 ~ handleSubmit ~ spotId: ", "color: gold; font-size: 25px", spotId, "versus spot.id: ", spot.id); //spot.id does not function well
		// if (!submissionReview.errors) {
		setReview("")
		setStars(0)
		closeModal()


		await dispatch(thunkCreateReview(spotId, user, createReview))
			.then(closeModal())
			.then(closeMenu)
			.catch(async response => {
				const data = await response.json()
				if (data?.errors) {
					setErrors(data.errors)
					closeModal()
				} else if (data?.errorMessage) {
					setErrors(data)
					closeModal()
				}
			})
		setReview("")
		setStars(0)

		await dispatch(thunkReceiveSpot(spotId))
		await dispatch(thunkLoadAllReviews(spotId));
		closeModal()
		closeMenu
	}



	return (
		<>
			<div className="outer-post-review">
				<div className="inner-post-review">
					<h2>How was your stay?</h2>

					{Object.values(errors).length === 0 && Object.values(errors).map((err, ind) =>
						<p key={ind} className="obj-err">{err}</p>

					)}
					<form className="review-form" onSubmit={handleSubmit} onClick={toggleMenu}>
						<div>

							<textarea name="user-review" id="user-review"
								placeholder="Leave your review here..."
								cols="30" rows="10"
								maxLength={245}
								value={review}
								onChange={(e) => setReview(e.target.value)}

							></textarea>
							<p className="p-error">{errors.review}</p>
						</div>

						<div id="star-ratings-reviews">
							<StarRatingInput stars={stars} onChange={onChange} />
						</div>
						{"stars" in errors && <p className="p-error">{errors.stars}</p>}
						<button className="user-spot-review-submit" disabled={allow}>Submit Your Review</button>
					</form>

				</div>
			</div>

		</>


	)

}


export default CreateReview;
