import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { thunkLoadSpotImages } from "../../../store/spot";
import './SpotImages';

function SpotImages({ spot }) {
	console.log("🚀 %c ~ file: SpotImages.jsx:5 ~ SpotImages ~ spot:", "color: cyan; font-size: 25px", spot, spot.id)

	const dispatch = useDispatch();
	const spotId = spot.id;

	console.log("%c testing for spot id: ", "color: orange; font-size: 25px", spotId)
	const displayImage = spot.previewImage;
	const [img, setImg] = useState();

	useEffect(() => {
		setImg(displayImage)
		dispatch(thunkLoadSpotImages(spotId))

	}, [dispatch, img, displayImage, spotId])


	return (
		<li className="spot-item">

			<div className="spot-image">
				<span id="id-spot-image">
					<Link to={`/spots/${spotId}`}>
						<img src={img} alt={spot.name} style={
							{
								backgroundImage: `${setImg}`,
								height: 225,
								width: 225,
								overflow: "hidden",
								objectFit: "cover",
								overflowClipMargin: "content-box",
								borderRadius: 30
							}
						}
						/>

					</Link>
				</span>
			</div>
		</li>
	)

}


export default SpotImages;
