import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { thunkReceiveSpot, thunkLoadSpotImages } from "../../../store/spot";
import './SpotPage.css';
import SpotDetails from "../SpotImages";
import SpotPageImages from "../SpotPageImages/SpotPageImages";


function SpotPage() {
	// console.log("🚀 ~ file: SpotPage.jsx:8 ~ SpotPage ~ props:", props)
	// const spot = useSelector(state => state.spots);

	// ! got stuck on the following:
	/*

	- not being able to render all the images, wondering if its possible to dispatch more than one thing in a component - yes
	- unable to use custom obj below; that is if the below is considered custom obj ? its more of a conditional.. where would i put the custom obj?

	*/
	const dispatch = useDispatch();
	const { spotId } = useParams();
	const navigate = useNavigate();
	const [toSpot, setToSpot] = useState(); // useState causes re-render of your component if you call its setter with a new reference in memory.
	const [imgs, setImgs] = useState();



	const spotObj = useSelector(state => state.spots);
	console.log("🚀 ~ file: SpotPage.jsx:26 ~ SpotPage ~ spotObj:", spotObj)
	const spot = spotObj[spotId];

	console.log("🚀 %c ~ file: SpotPage.jsx:8 ~ SpotPage ~ SPOT:", "color: pink; font-size: 25px", spot); // spots is an array of objects

	// const displayImage = spot.SpotImages; // this cannot be done or itll break and think there is no spot




	useEffect(() => {
		// setImgs(displayImages)
		dispatch(thunkReceiveSpot(spotId))
		dispatch(thunkLoadSpotImages(spotId))

	}, [dispatch, toSpot, spotId])


	if (!spot || !spot.Owner) {
		return null
	}
	// const handleSubmit = async (e) => {
	// 	e.preventDefault();
	// 	navigate(`/spots/${toSpot}`);

	// }

	return (
		<>
			<section id="spot-page-section" style={{maxWidth: 1000}}>
				<div className="spot-page_text-info">
					<h2>{spot.name}</h2>
					<h4>{spot.city}, {spot.state}, {spot.country}</h4>
				</div>
				<div className="spot-page_pics">
					<SpotPageImages key={spot.id} spot={spot}/>
				</div>
				<div className="spot-page_host_and_reserve">
					placeholder
				</div>
				<br />
				<div className="spot-page_reviews">placeholder</div>
			</section>
		</>
	)
}


export default SpotPage;
