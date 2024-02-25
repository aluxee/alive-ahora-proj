import { useState } from "react";

const ThemeState = () => {

	// console.log('light mode', useState('light')); // returns two: The first value is your current state; the second value is the updater function used to update the state.
	const [theme, setTheme] = useState('light');
	// * toggle dark and light theme coming soon (and to be included with localStorage)

	if (theme === 'light') {
		setTheme('light')
	} else {
		setTheme('dark')
	}
	
	<div className={`state ${theme}`}>
	</div>


	return (
		<div className="state">
			<h1>ThemeState Component</h1>
			<button>Dark</button>
			<button>Light</button>
		</div>
	);
};

export default ThemeState;
