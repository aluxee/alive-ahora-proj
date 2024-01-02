import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useModal } from "../../../context/Modal";
import { thunkRemoveReview } from "../../../store/review";


function RemoveReview({ review }) {

	// console.log("%c 🚀 ~ file: RemoveReview.jsx:8 ~ RemoveReview ~ review: ", "color: white; font-size: 25px", review)


	const dispatch = useDispatch();
	const { closeModal } = useModal();
	const reviewObj = useSelector(state => state.reviews)
	const reviews = Object.values(reviewObj)
	const [showDeleteMenu, setShowDeleteMenu] = useState(false);
	const [currState, setCurrState] = useState([reviews]);

	// console.log("%c 🚀 ~ file: RemoveReview.jsx:14 ~ RemoveReview ~ reviews: ", "color: white; font-size: 25px", reviews)


	const toggleMenu = (e) => {
		e.stopPropagation();

		setShowDeleteMenu(!showDeleteMenu);
	};



	const handleDelete = async (reviewId) => {

		// console.log("%c 🚀 ~ file: RemoveReview.jsx:32 ~ handleDelete ~ reviewId: ", "color: pink; font-size: 35px", reviewId)



		await dispatch(thunkRemoveReview(review))
			.then(setCurrState(currState))
			.then(closeModal())
	}


	const noDelete = async (e) => {
		e.preventDefault();

		closeModal();
	}



	return (
		<div className="outer-container-delete">
			<div className="inner-container-delete">
				<div className="delete-review-modal-container">
					<h1>Confirm Delete</h1>
					<h3>Are you sure you want to delete this review?</h3>
					<form id="delete-review_confirm" onClick={toggleMenu}>

						<div className="delete-review-options">
							<button onClick={handleDelete} className="delete-review-button" id="delete-review-yes">Yes (Delete Review)</button>
							<button className="delete-review-button" id="delete-review-no" onClick={noDelete}>No (Keep Review)</button>
						</div>
					</form>
				</div>
			</div>
		</div>

	)
}


export default RemoveReview;
