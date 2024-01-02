import { useState } from "react";


function StarRatingInput({ stars, onChange }) {
	const [activeStars, setActiveStars] = useState(stars);

	return (
		<div className="star-reviews-direct-container">
			<ul className="star-reviews-list" style={{ listStyle: "none" }}>
				<>
					Stars
				</>
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
			<div className="peek-a-boo" style={{ visibility: "hidden" }}>

			</div>
		</div>
	)
}


export default StarRatingInput;
