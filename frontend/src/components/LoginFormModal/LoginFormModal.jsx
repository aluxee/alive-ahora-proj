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

	const demoUser = (e) => {
		e.preventDefault();
		setErrors({})
		dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password' }))
			.then(closeModal())
			.catch(async response => {
				const data = await response.json();
				if (data && data.errors) {
					setErrors(data.errors)
				}
			})
	}


	return (
		<>
			<div className='login_container'>

				<h1>Log In</h1>
				<form onSubmit={handleSubmit} className='loginForm'>
					<div className='login'>

						{errors.message && <p className='p-error'>{errors.message}</p>}
						<label className='box_login' id='login_one'>
							<input
								placeholder='Username or Email'
								type="text"
								value={credential}
								onChange={(e) => setCredential(e.target.value)}
								required
							/>
						</label>
					</div>
					<div className='login'>

						<label className='box_login' id='login_two'>
							<input
								placeholder='Password'
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</label>
						{errors.credential && <p className='p-error'>{errors.credential}</p>}
					</div>
					<button
						type="submit"
						id='login_submit'
						className='disabled'
						disabled={credential.length < 4 || password.length < 6}
					>Log In</button>
					<button className='demo' onClick={demoUser}>Log in as Demo User</button>
				</form>
			</div>
		</>
	);
}

export default LoginFormModal;
