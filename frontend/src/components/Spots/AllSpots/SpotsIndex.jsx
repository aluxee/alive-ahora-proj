import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
import * as spotActions from "../../../store/spot";


function SpotsIndex() {
	const dispatch = useDispatch();
	const spot = useSelector(state => state.spots);

	console.log("%c spot (before):", "font-size: 25px; color: red", spot)

	const spots = Object.values(spot)
	console.log("%c spot (after):", "font-size: 25px; color: red", spots)

dispatch(spotActions.thunkLoadSpots())
	return (
		<h1>All the spots will be here</h1>
	)
}


export default SpotsIndex;
