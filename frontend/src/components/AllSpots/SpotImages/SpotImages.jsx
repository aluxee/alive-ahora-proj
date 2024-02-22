import { useDispatch } from "react-redux";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { thunkLoadSpotImages } from "../../../store/spot";
import './SpotImages';
// import video from './video.mp4';
import One from '../../../videos/one.mp4'






function SpotImages({ spot }) {

	console.log("%c 🚀 ~ SpotImages ~ spot: ", "color: red; font-size: 25px", spot)
	console.log("🚀 %c ~ file: SpotImages.jsx:5 ~ SpotImages ~ spot:", "color: cyan; font-size: 25px", spot, spot.id)

	const dispatch = useDispatch();
	const spotId = spot.id;

	console.log("%c testing for spot id: ", "color: orange; font-size: 25px", spotId)
	const displayImage = spot.previewImage;
	const [img, setImg] = useState("");
	const [hover, setHover] = useState(false);

	useEffect(() => {
		setImg(displayImage)
		dispatch(thunkLoadSpotImages(spotId))

	}, [dispatch, img, displayImage, spotId])




	// useEffect(() => { vidRef.current.play(); }, []);

	const imgStyle = {
		backgroundImage: `${setImg}`,
		height: 225,
		width: 225,
		overflow: "hidden",
		objectFit: "cover",
		overflowClipMargin: "content-box",
		borderRadius: 30
	}

	const thumbNailImg = () => {
		const videoSources = [
			null,
			One,
			// Two,
			// Three,
			// Four,
			// Five
		]

		const videoSource = videoSources[spot.id] || null;

//! How can we fix the below videoSource so that the size fits better into it's box?
		return (
			<>
				{hover && videoSource ?

					<video src={videoSource}
						loop muted autoPlay
						// style={{ width: "225", height: "225" }}
						width={225}
						height={225}

						// overflowClipMargin="content-box"

					/>

					:
					<img src={img} alt={spot.name} className="spot-image-box" style={imgStyle}/>

				}
			</>
		)
	}


	return (
		<li className="spot-item">

			<div className="spot-image">
				<div id="id-spot-image">
					<Link to={`/spots/${spotId}`}
						onMouseEnter={() => setHover(true)}
						onMouseLeave={() => setHover(false)}

					>
						<>
						{thumbNailImg()}
						</>
						{/* {hover ? <>{thumbNailImg()}</>
							:
							<img src={img} alt={spot.name} className="spot-image-box"


								style={
									imgStyle
								}

							/>
						} */}
					</Link>
				</div>
			</div>
		</li>
	)

}


export default SpotImages;
