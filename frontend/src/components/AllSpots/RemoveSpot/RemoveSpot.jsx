import { useDispatch, useSelector } from "react-redux";
import {
	useState, useRef,
	useEffect
} from "react";
import { thunkLoadCurrentSpots, thunkRemoveSpot } from "../../../store/spot";
import { useModal } from "../../../context/Modal";
import './RemoveSpot.css';




function RemoveSpot({ spot }) {

	const { closeModal } = useModal();
	const dispatch = useDispatch();
	// const navigate = useNavigate(); // cannot use navigate here as it is not a component is not a descendant of the router component
	const spots = useSelector(state => state.spots)
	const ulRef = useRef();
	const [showDeleteMenu, setShowDeleteMenu] = useState(false);
	const [currState, setCurrState] = useState([spots]);

	// console.log("%c 🚀 ~ file: RemoveSpot.jsx:24 ~ RemoveSpot ~ currState: ", "color: red; font-size: 25px", currState)

	// console.log("🚀 %c ~ file: RemoveSpot.jsx:13 ~ spot: (recently added as a prop to removeSpots instead of extraction from useSelector)", "color: orange; font-size: 32px", spot);




	const toggleMenu = (e) => {
		e.stopPropagation();

		setShowDeleteMenu(!showDeleteMenu);
	};



	const handleDelete = async (spotId) => {

		// console.log("%c 🚀 ~ file: RemoveSpot.jsx:42 ~ handleDelete ~ spotId: ", "color: blue; font-size: 25px", spotId)


		// console.log("inside Handle delete prior to the 'return' of the dispatch", currState)


		dispatch(thunkRemoveSpot(spot))
		const remainingSpots = spots.filter(spot => spot.id !== spotId)
		setCurrState(remainingSpots)

		// console.log("after dispatch: ", currState)

		closeModal()


	}

	const noDelete = async (e) => {
		e.preventDefault();

		await dispatch(thunkLoadCurrentSpots)
		closeModal();
	}



	useEffect(() => {
		dispatch(thunkLoadCurrentSpots)
	}, [dispatch, currState])

	return (
		<>
			<div className="outer-delete-container">
				<div className="inner-delete-container">

					<div className="delete-spot_container">

						<h1> Confirm Delete</h1>
						<h3>Are you sure you want to remove this spot
							from the listings?</h3>
						<form id="delete-spot_confirm" onClick={toggleMenu}>

							<div ref={ulRef} className="delete-spot-options">
								<button onClick={handleDelete} className="delete-spot-button" id="delete-spot-yes">Yes (Delete Spot)</button>
								<button className="delete-spot-button" id="delete-spot-no" onClick={noDelete}>No (Keep Spot)</button>
							</div>
						</form>
					</div>

				</div>
			</div>
		</>


	)
}


export default RemoveSpot;
