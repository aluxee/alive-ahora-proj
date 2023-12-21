import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { thunkLoadSpotImages } from "../../../store/spot";


function SpotPage(spot) {
console.log("🚀 ~ file: SpotPage.jsx:8 ~ SpotPage ~ spot:", spot)
// console.log("🚀 ~ file: SpotPage.jsx:8 ~ SpotPage ~ props:", props)
// ! got stuck on the following:
/*
-	not being able to find spot to use for spotId
- not being able to render all the images, wondering if its possible to dispatch more than one thing in a component
- unable to use custom obj below; that is if the below is considered custom obj ? its more of a conditional.. where would i put the custom obj?

*/
	const dispatch = useDispatch();
	const spotObj = useSelector(state => state.spots)
	const { spotId } = useParams();
	// const displayImage = spot.previewImage;
	// const [img, setImg] = useState();
console.log(spotObj)
	// const selectedSpot = spotObj[spotId]; // populate from Redux store
	console.log("🚀 %c ~ file: SpotPage.jsx:15 ~ SpotPage ~ selectedSpot:", "color: magenta; font-size: 25px", spotId); // "spot" does not appear


	useEffect(() => {
		// setImg(displayImage)
		dispatch(thunkLoadSpotImages(spotId))
		// dispatch(thunkReceiveSpot(spot))

	}, [dispatch, spotId])


		// if (!spot || !spot.Owner) {
		// 	return null
		// }


	return (
		<h1>SpotPage is being rendered...</h1>
	)
}


export default SpotPage;
