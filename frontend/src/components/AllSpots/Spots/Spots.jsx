import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import * as spotActions from "../../../store/spot";
import SpotImages from "../SpotImages";
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
						<>
							<div className="spot-item-div">
								<SpotImages
									spot={spot}
									key={spot.id}
								/>
								<div className="spot-name-rate">
									<span id="spot-state-city">{spot.state}, {spot.city}</span>
									<span id="spot-rating">
										<i className="fa-solid fa-star"></i>
										{spot.avgRating}
									</span>
								</div>
								<div className="spot-price">
									<span>${spot.price} night</span>
									<span></span>
								</div>
							</div>
						</>
					))
					}
				</ul>
			</section>
		</>
	)
}


export default Spots;
