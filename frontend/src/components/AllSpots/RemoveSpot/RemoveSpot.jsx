import { useDispatch, useSelector } from "react-redux";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { thunkLoadCurrentSpots, thunkRemoveSpot } from "../../../store/spot";
import { useModal } from "../../../context/Modal";



function RemoveSpot({ id }) {
	console.log("inside remove spot -- id: ", id
	)
	const { closeModal } = useModal();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const ulRef = useRef();
	const [showDeleteMenu, setShowDeleteMenu] = useState(false);
	const spot = useSelector(state => state.spots[id]); // isolates the object of array to that specified spot's id to only get that specific spot with all it's info
	console.log("🚀 %c ~ file: RemoveSpot.jsx:13 ~ spot:", "color: orange; font-size: 32px", spot);


	const toggleMenu = (e) => {
		e.stopPropagation();

		setShowDeleteMenu(!showDeleteMenu);
	};



	const handleDelete = async (e) => {
		e.preventDefault();

		await dispatch(thunkRemoveSpot(spot.id));
		closeModal();
		navigate('/spots/current');
	}

	const noDelete = async (e) => {
		e.preventDefault();

		await dispatch(thunkLoadCurrentSpots)
		closeModal();
	}

	return (
		<>

			<div className="delete-spot_container">

				<h1> Confirm Delete</h1>
				<h3>Are you sure you want to remove this spot
					from the listings?</h3>
				<form id="delete-spot_confirm" onClick={toggleMenu}>

					<div ref={ulRef}>
						<button onClick={handleDelete} id="delete-spot-yes">Yes (Delete Spot)</button>
						<button id="delete-spot-no" onClick={noDelete}>No (Keep Spot)</button>
					</div>
				</form>
			</div>

		</>


	)
}


export default RemoveSpot;
