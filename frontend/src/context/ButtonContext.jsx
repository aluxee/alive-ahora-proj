import { createContext, useState, useEffect, useRef } from "react";

export const ButtonContext = createContext();

export function ButtonProvider(props) {

	// dup profile button code, extrapolate what's necessary for sharing
	const ulRef = useRef();
	const [showMenu, setShowMenu] = useState(false);
	const [hover, setHover] = useState(false);

	// const dispatch = useDispatch();

	// const onHover = () => {
	// 	setHover(true)
	// };



	// const hovering = (e) => {
	// 	e.stopPropagation();

	// 	setHover(!hover)
	// }

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

	// const logout = (e) => {
	// 	e.preventDefault();

	// 	dispatch(sessionActions.logout());
	// 	closeMenu();
	// 	navigate('/')
	// 	alert("You have logged out.")
	// }

	// const manageSpots = (e) => {
	// 	e.preventDefault();


	// 	navigate('/spots/current');
	// 	closeMenu();
	// }

	return (
		<ButtonContext.Provider value={{ showMenu, setShowMenu, hover, setHover, closeMenu, toggleMenuButton, ulRef }}>
			{props.children}
		</ButtonContext.Provider>
	)

}
