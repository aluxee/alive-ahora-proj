import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
	const dispatch = useDispatch();
	const [credential, setCredential] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});
	const { closeModal } = useModal(); // LoginFormModal consuming the ModalContext’s closeModal value and then invoke the closeModal function when the login action is successful (below)



	const handleSubmit = (e) => {
		e.preventDefault();
		setErrors({});

		return dispatch(sessionActions.login({ credential, password })).then(closeModal)
		.catch(
			async (response) => {
				const data = await response.json();
				if (data && data?.errors) setErrors(data.errors);
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

export default LoginFormModal;
