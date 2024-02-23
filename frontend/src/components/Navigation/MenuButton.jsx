import { NavLink } from "react-router-dom";
import './MenuButton.css';
import { useContext } from "react";
import { ButtonContext } from "../../context/ButtonContext";




function MenuButton() {

	const { showMenu, hover, setHover } = useContext(ButtonContext);


	const menuHover = () => {
		setHover("menu")
	};

	const menuHovering = () => {

		setHover("")
	};


	const hoverClassName = "caption" + (hover === "menu" ? "" : "hidden")

	return (
		<>
			<div className="menu-select-no-drop">
				<NavLink to='/' className='house-icon'>
					<i className="fa-solid fa-bars"
						onMouseEnter={menuHover}
						onMouseLeave={menuHovering}
						role="link"
					/>
					{hover === "menu" && <p className={hoverClassName + (showMenu ? setHover("") : "")}>Return Home</p>}
				</NavLink>
			</div>
		</>
	)
}

export default MenuButton;
