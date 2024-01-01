import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';



function SignupFormModal() {
	const dispatch = useDispatch();

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [password, setPassword] = useState('');
	const [confirmedPassword, setConfirmedPassword] = useState('');
	const [errors, setErrors] = useState({});
	const [auth, setAuth] = useState(true);
	const { closeModal } = useModal();



	useEffect(() => {

		if (!email || username.length < 4 || !firstName || !lastName || password.length < 6 || !confirmedPassword) {
			setAuth(true)
		} else { setAuth(false) }

	}, [email, username.length, firstName, lastName, password.length, confirmedPassword])

	const handleSubmit = (e) => {
		e.preventDefault();
		setErrors({});

		if (password === confirmedPassword) {
			console.log("%c 🚀 ~ file: SignupFormModal.jsx:37 ~ handleSubmit ~ sessionActions: ", "color: purple; font-size: 25px", sessionActions)
			const validation = {};
			return dispatch(sessionActions.signupUser({
					email,
					username,
					firstName,
					lastName,
					password
				}))
				.then(closeModal)
				.catch(
					async (response) => {
					const data = await response.json()
					console.log("%c 🚀 ~ file: SignupFormModal.jsx:50 ~ handleSubmit ~ response data: ", "color: red; font-size: 25px", response, response.json, data)

					if (data && data?.errors) {
						validation.errors = data.errors;
						setErrors(data.errors);
					}
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
					<label className='signup_username'>
						Username
						<input
							placeholder='username'
							type='text'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</label>
					{errors.username && <p>{errors.username}</p>}

					<label className='signup_email'>
						Email
						<input
						placeholder='email'
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
						placeholder='enter your first name'
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
							placeholder='enter your last name'
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
						placeholder='password'
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
						placeholder='confirm password'
							type="password"
							value={confirmedPassword}
							onChange={(e) => setConfirmedPassword(e.target.value)}
							required
						/>
					</label>
					{errors.confirmedPassword && <p>{errors.confirmedPassword}</p>}
					<button
						type='submit'
						disabled={auth}
						className='signup-submit-button'
					>
						Sign Up
					</button>
				</div>
			</form >
		</>
	);
}


export default SignupFormModal;
