import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
// import { useSelector } from "react-redux";
import './MenuButton.css';
import ProfileButton from "./ProfileButton";
import { useContext } from "react";
import { ButtonContext } from "../../context/ButtonContext";




function MenuButton() {

	// const [hover, setHover] = useState(false);
	const { showMenu, hover, setHover, closeMenu } = useContext(ButtonContext);


	const menuHover = () => {
		setHover(true)
	};

	const menuHovering = (e) => {
		e.stopPropagation();

		setHover(!hover)
	};

	// useEffect(() => {
	// 	if (!hover) return;

	// 	document.addEventListener('click', setShowMenu(true))

	// 	return () => document.removeEventListener('click', setShowMenu(true))

	// }, [hover, setShowMenu])


	// const offMenuHover = (e) => {

	// 	setHover(!hover)
	// };

	const hoverClassName = "caption" + (hover ? "" : "hidden")

	console.log("%c 🚀 ~ MenuButton ~ ProfileButton: ", "color: red; font-size: 25px", ProfileButton.ulRef)

	return (
		<>
			<div className="menu-select-no-drop">
				<NavLink to='/' className='house-icon'>
					< i className="fa-solid fa-bars"
						onMouseEnter={menuHover}
						// onMouseEnter={(e) => menuHover && console.log('onMouseEnter of MenuButton', e)}
						// onMouseOut={hovering}
						onMouseLeave={menuHovering}
						role="link"
					/>
					{hover && <p className={hoverClassName + (showMenu ? setHover(false) : "")}>Return Home</p>}
				</NavLink>
			</div>
		</>
	)
}

export default MenuButton;
