import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import './LoginForm.css';

function LoginFormPage() {
	const dispatch = useDispatch();
	const sessionUser = useSelector((state) => state.session.user);
	const [credential, setCredential] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});

	if (sessionUser) return <Navigate to="/" replace={true} />;

	console.log("sessionUser: ", sessionUser)

	const handleSubmit = (e) => {
		e.preventDefault();
		setErrors({});

		return dispatch(sessionActions.login({ credential, password })).catch(
			async (response) => {
				const data = await response.json();
				if (data?.errors) setErrors(data.errors);
			}
		);

	};

	return (
		<>
			<div className='login_container'>

				<h1>Log In</h1>
				<form onSubmit={handleSubmit} className='loginForm'>
					<label className='box_login' id='login_one'>
						Username or Email
						<input
							type="text"
							value={credential}
							onChange={(e) => setCredential(e.target.value)}
							required
						/>
					</label>
					<label className='box_login' id='login_two'>
						Password
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</label>
					{errors.credential && <p>{errors.credential}</p>}
					<button type="submit" id='login_submit'>Log In</button>
				</form>
			</div>
		</>
	);
}

export default LoginFormPage;
