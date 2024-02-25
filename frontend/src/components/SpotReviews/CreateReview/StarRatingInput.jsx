import { useState } from "react";


function StarRatingInput({ stars, onChange }) {
	const [activeStars, setActiveStars] = useState(stars);


	const starsFunc = () => {
		if (activeStars === 5) {
			return (
				<div>
					5 Stars
				</div>
			)
		} else if (activeStars === 4) {
			return (
				<div>
					4 Stars
				</div>
			)
		} else if (activeStars === 3) {
			return (
				<div>
					3 Stars
				</div>
			)
		} else if (activeStars === 2) {
			return (
				<div>
					2 Stars
				</div>
			)
		} else if (activeStars === 1) {
			return (
				<>
					<div>
						1 Star
					</div>
				</>
			)
		} else {
			return (
				<div>
					Stars
				</div>
			)
		}
	}


	const peekABoo = () => {
		if (activeStars === 5) {
			return (
				<div role="img" aria-label="star-struck"
					style={{ fontSize: "4em", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}
				>
					🤩
				</div>
			)
		} else if (activeStars === 4) {
			return (
				<div role="img" aria-label="plain-smile"
					style={{ fontSize: "4em", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}
				>
					😊
				</div>
			)
		} else if (activeStars === 3) {
			return (
				<div role="img" aria-label="dotted-neutral"
					style={{ fontSize: "4em", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}
				>
					🫥
				</div>
			)
		} else if (activeStars === 2) {
			return (
				<div role="img" aria-label="peeking-eye"
					style={{ fontSize: "4em", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}
				>
					🫣
				</div>
			)
		} else if (activeStars === 1) {
			return (
				<div role="img" aria-label="steam-from-nose"
					style={{ fontSize: "4em", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}
				>
					😤
				</div>
			)
		} else {
			return (
				null
			)
		}

	}
	return (
		<div className="star-reviews-direct-container">
			<ul className="star-reviews-list" style={{ listStyle: "none" }}>
				<div className="stars-text"
					style={{ marginLeft: "0.5rem" }}
				>
					{starsFunc()}
				</div>
				<li id="setStars-5" className={activeStars === 5 ? 'filled' : 'empty'} >
					<i
						className={'fa fa-star'}
						onMouseEnter={() => { setActiveStars(5); }}
						onMouseLeave={() => { setActiveStars(stars) }}
						onClick={() => { onChange(5) }}
					></i>
				</li><li id="setStars-4" className={activeStars >= 4 ? 'filled' : 'empty'} >
					<i
						className={'fa fa-star'}
						onMouseEnter={() => { setActiveStars(4); }}
						onMouseLeave={() => { setActiveStars(stars) }}
						onClick={() => { onChange(4) }}
					></i>
				</li><li id="setStars-3" className={activeStars >= 3 ? 'filled' : 'empty'} >
					<i
						className={'fa fa-star'}
						onMouseEnter={() => { setActiveStars(3); }}
						onMouseLeave={() => { setActiveStars(stars) }}
						onClick={() => { onChange(3) }}
					></i>
				</li>
				<li id="setStars-2" className={activeStars >= 2 ? 'filled' : 'empty'} >
					<i
						className={'fa fa-star'}
						onMouseEnter={() => { setActiveStars(2); }}
						onMouseLeave={() => { setActiveStars(stars) }}
						onClick={() => { onChange(2) }}
					></i>
				</li>
				<li id="setStars-1" className={activeStars >= 1 ? 'filled' : 'empty'} >
					<i
						className={'fa fa-star'}
						onMouseEnter={() => { setActiveStars(1); }}
						onMouseLeave={() => { setActiveStars(stars) }}
						onClick={() => { onChange(1) }}
					></i>
				</li>
			</ul>
			<div className="peek-a-boo">
				{peekABoo()}
			</div>
		</div>
	)
}


export default StarRatingInput;
