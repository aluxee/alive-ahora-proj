import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import * as spotActions from "../../../store/spot";
import SpotDetails from "../SpotDetails";
import './Spots.css';
function Spots() {
	const dispatch = useDispatch();
	const spot = useSelector(state => state.spots);

	console.log("%c spot (before):", "font-size: 25px; color: red", spot)

	const spots = Object.values(spot)
	console.log("%c spot (after):", "font-size: 25px; color: blue", spots)

	useEffect(() => {

		dispatch(spotActions.thunkLoadSpots())
	}, [dispatch])
	return (
		<>
			<section id="spots-section">
				<ul className="spots-list">
					{spots.map(spot => (

						<SpotDetails
							spot={spot}
							key={spot.id}
						/>

					))
					}
				</ul>
			</section>

		</>
	)
}


export default Spots;
