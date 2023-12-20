import { useDispatch } from "react-redux";
import './SpotDetails';

function SpotDetails({ spot }) {
	console.log("🚀 %c ~ file: SpotDetails.jsx:5 ~ SpotDetails ~ spot:", "color: magenta; font-size: 25px", spot)

	const dispatch = useDispatch();




	return (
		<li className="spot-item">
			<div className="spot-item-div">
				<div className="spot-image">
					<span id="id-spot-image">
						<h2>preview image</h2>
					</span>
				</div>
				<div className="spot-name-rate">
					<span id="spot-state-city">{spot.state}, {spot.city}</span>
					<span id="spot-rating">
						<i className="fa-solid fa-star"></i>
						{spot.avgRating}
					</span>
				</div>
				<div className="spot-price">
					<span>{spot.price} night</span>
					<span></span>
				</div>
			</div>
		</li>
	)

}


export default SpotDetails;
