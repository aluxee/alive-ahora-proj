import { createContext, useState, useEffect } from "react";


export const ButtonContext = createContext();

export function ButtonProvider() { //* add user here?

	// dup profile button code, extrapolate what's necessary for sharing
	const ulRef = useRef();
	const [showMenu, setShowMenu] = useState(false);
	const [hover, setHover] = useState(false);

	// const onHover = () => {
	// 	setHover(true)
	// };

	// const offHover = () => {
	// 	setHover(!hover)
	// }

	// const hovering = (e) => {
	// 	e.stopPropagation();

	// 	offHover();
	// }

	const toggleMenu = (e) => {
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

	const logout = (e) => {
		e.preventDefault();

		dispatch(sessionActions.logout());
		closeMenu();
		navigate('/')
		alert("You have logged out.")
	}

	// const manageSpots = (e) => {
	// 	e.preventDefault();


	// 	navigate('/spots/current');
	// 	closeMenu();
	// }

	return (
		<ButtonContext.Provider value={{ showMenu, setShowMenu, hover, setHover, toggleMenu, logout}}>
			{props.children}
		</ButtonContext.Provider>
	)

}
