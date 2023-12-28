import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { thunkReceiveSpot, thunkLoadSpotImages } from "../../../store/spot";
import './SpotPage.css';
import SpotPageImages from "../SpotPageImages/SpotPageImages";


function SpotPage() {

	const dispatch = useDispatch();
	const { spotId } = useParams();

	const [toSpot, setToSpot] = useState(); // useState causes re-render of your component if you call its setter with a new reference in memory.
	const spotObj = useSelector(state => state.spots);
	const spot = spotObj[spotId];


	useEffect(() => {
		setToSpot(spotId)
		dispatch(thunkReceiveSpot(spotId))
		dispatch(thunkLoadSpotImages(spotId))

	}, [dispatch, toSpot, spotId])

	if (Object.keys(spotObj).length === 0) {
		return null;
	}

	if (!spot || !spot.Owner) {
		return null
	}
	// const handleSubmit = async (e) => {
	// 	e.preventDefault();
	// 	navigate(`/spots/${toSpot}`);

	// }


	// console.log("🚀 %c ~ file: SpotPage.jsx:26 ~ SpotPage ~ spotObj:", "color: blue; font-size: 26px", spotObj,)

	// console.log("🚀 %c ~ file: SpotPage.jsx:8 ~ SpotPage ~ SPOT:", "color: pink; font-size: 25px", spot, spot.Owner); // spots is an array of objects; spot is an object
	const ownerObj = spot.Owner;
	// console.log("🚀 ~ file: SpotPage.jsx:26 ~ SpotPage ~ ownerObj:", ownerObj, ownerObj.firstName)



	return (
		<>
			<section id="spot-page-section" style={{ maxWidth: 1000 }}>


				<div className="spot-page_text-info">
					<h2>{spot.name}</h2>
					<h4>{spot.city}, {spot.state}, {spot.country}</h4>
				</div>
				<div className="spot-page_pics">
					<SpotPageImages key={spot.id} spot={spot} />
				</div>
				<div className="spot-page_part-two">
					<div className="spot-page_host">
						<h2>
							Hosted by {ownerObj.firstName} {ownerObj.lastName}
						</h2>
						<p>{spot.description}</p>
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel possimus, suscipit placeat rem deleniti quo veritatis, nisi dolorum incidunt voluptatibus a, expedita doloribus eveniet ab vitae architecto natus unde adipisci. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia magni alias ipsam blanditiis nihil, rerum vitae sed exercitationem cumque porro ipsum quos dolor veniam non, pariatur ratione? Facere, ad possimus. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eveniet, ab earum obcaecati iste eum cum, alias aliquam nam vero provident tenetur voluptatibus quaerat consectetur repellat impedit numquam voluptate repudiandae fugiat.</p>
					</div>
					<div className="spot-page_price_and_reserve">
						<div id="spot-page_price">
							<span>${spot.price} night</span>
							<span></span>
						</div>
						<div id="spot-page_ratings_container">
							<span id="spot-page_rating" style={{fontSize: 12}}>
								<i className="fa-solid fa-star"></i>
								{spot.avgRating} · {spot.numReviews}  reviews
							</span>
						</div>
						<button id="spot-page_button">reserve</button>
					</div>
				</div>

				<hr />
				<div className="spot-page_reviews">placeholder</div>
			</section>
		</>
	)
}


export default SpotPage;
