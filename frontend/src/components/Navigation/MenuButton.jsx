import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import './MenuButton.css';
import ProfileButton from "./ProfileButton";
function MenuButton() {

	const [hover, setHover] = useState(false);

	//! Need to figure out how to hide other caption when any button on the document, including modals, is clicked


	useEffect(() => {
		if (!hover) return;

		document.addEventListener('click', isButtonClicked)

		return () => document.removeEventListener('click', isButtonClicked)

	}, [hover])
	const onHover = () => {
		setHover(true)
	};

	const offHover = (e) => {
		e.stopPropagation();

		setHover(!hover)
	};

	const hoverClassName = "caption" + (hover ? "" : "hidden")

	console.log("%c 🚀 ~ MenuButton ~ ProfileButton: ", "color: red; font-size: 25px", ProfileButton.ulRef)

	return (
		<>
			<div>
				<NavLink to='/' className='house-icon'>
					< i className="fa-solid fa-bars"
						onMouseOver={onHover}
						onMouseOut={offHover}
					/>
					{/* {hover && <p className={hoverClassName + (isButtonClicked ? alert("this is true") : "")}>Return Home</p>} */}
				</NavLink>
			</div>
		</>
	)
}

export default MenuButton;
