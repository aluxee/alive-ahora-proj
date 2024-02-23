import { createContext, useState, useEffect, useRef } from "react";

export const ButtonContext = createContext();

export function ButtonProvider(props) {

	// dup profile button code, extrapolate what's necessary for sharing
	const ulRef = useRef();
	const [showMenu, setShowMenu] = useState(false);
	const [hover, setHover] = useState("");


	const toggleMenuButton = (e) => {
		e.stopPropagation();// Keep click from bubbling up to document and triggering closeMenu
		setShowMenu(!showMenu)
	}

	useEffect(() => {

		if (!showMenu) return;
		if (!hover) return;

		const closeMenu = (e) => {
			if (!ulRef.current.contains(e.target)) {
				setShowMenu(false);
			}
		}

		document.addEventListener('click', closeMenu);

		return () => document.removeEventListener('click', closeMenu)
	}, [showMenu, hover]);

	const closeMenu = () => setShowMenu(false);

	const contextValue = {
		showMenu, setShowMenu, hover, setHover, closeMenu, toggleMenuButton, ulRef
	}

	return (
		<ButtonContext.Provider value={contextValue}>
			{props.children}
		</ButtonContext.Provider>
	)

}
