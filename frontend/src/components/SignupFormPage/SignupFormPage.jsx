import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import './SignupForm.css';



function SignupFormPage() {
	const dispatch = useDispatch();
	const sessionUser = useSelector((state) => state.session.user);

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [password, setPassword] = useState('');
	const [confirmedPassword, setConfirmedPassword] = useState('');
	const [errors, setErrors] = useState('');

	const defUser = {
		email,
		username,
		firstName,
		lastName,
		password
	}

	if (sessionUser) return <Navigate to={'/'} replace={true} />

	const handleSubmit = (e) => {
		e.preventDefault();

		if (password === confirmedPassword) {
			setErrors({});
			return dispatch(
				sessionActions.signup(defUser)
			).catch(async (response) => {
				const data = await response.json();
				if (data?.errors) { setErrors(data.errors) }
			})
		}
		return setErrors({
			confirmedPassword: "Confirm Password field must be the same as the Password field"
		})
	}

	return (
		<>
			<h1>Sign Up</h1>

			<form onSubmit={handleSubmit}>
				<div className='signup_container'>
					<label class='signup_username'>
						Username
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</label>
					{errors.username && <p>{errors.username}</p>}

					<label className='signup_email'>
						Email
						<input
							type='text'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</label>
					{errors.email && <p>{errors.email}</p>}

					<label className='signup_firstName'>
						First Name
						<input
							type="text"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							required
						/>
					</label>
					{errors.firstName && <p>{errors.firstName}</p>}

					<label className='signup_lastName'>
						Last Name
						<input
							type="text"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
							required
						/>
					</label>
					{errors.lastName && <p>{errors.lastName}</p>}

					<label className='signup_password'>
						Password
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</label>
					{errors.password && <p>{errors.password}</p>}

					<label className='signup_confirmedPassword'>
						Confirm Password
						<input
							type="password"
							value={confirmedPassword}
							onChange={(e) => setConfirmedPassword(e.target.value)}
							required
						/>
					</label>
					{errors.confirmedPassword && <p>{errors.confirmedPassword}</p>}
					<button type='submit'>Sign Up</button>
				</div>
			</form >
		</>
	);
}


export default SignupFormPage;
