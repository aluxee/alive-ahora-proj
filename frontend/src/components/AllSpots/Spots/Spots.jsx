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

						<div className="spot-item-div" key={spot.id}>
							<SpotImages
								spot={spot}
								key={spot.name}
							/>
							<div className="spot-info">

								<div className="spot-name-rate">
									<div id="spot-state-city">{spot.state}, {spot.city}</div>
									<div id="spot-rating">
										<i className="fa-solid fa-star" style={{color: "gold"}}></i>
										{
											spot.avgRating ?
												<>
													{parseFloat(spot.avgRating).toFixed(1)}
												</> :
												<>New!
												</>
										}
									</div>
								</div>
								<div className="spot-price">
									<div>${spot.price} / night</div>
									{/* <span></span> */}
								</div>
							</div>

						</div>
					))

					}
				</ul>
			</section>
		</>
	)
}


export default Spots;
