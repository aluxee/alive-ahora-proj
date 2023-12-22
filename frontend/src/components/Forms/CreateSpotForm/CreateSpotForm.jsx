import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import './CreateSpotForm.css';


function CreateSpotForm({ spot, formType }) {
	console.log("🚀 ~ file: CreateSpotForm.jsx:5 ~ CreateSpotForm ~ spot:", spot)
	//!  no such route w new so how to render? - will try to make a modal...? or create a url
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// for testing:
	const [understanding, setUnderstanding] = useState(spot?.understanding);
	const [improvement, setImprovement] = useState(spot?.improvement);
	const [errors, setErrors] = useState({});

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrors({}); // causing re-render
		spot = { ...spot };

		if (formType === 'Create Spot') {
			const submissionResults = await dispatch(thunkCreateSpot(spot))

			if (!submissionResults.errors) {
				navigate(`/spots/${submissionResults.id}`)
			} else {
				setErrors(submissionResults.errors)
			}
		}

	}

	// if (!user) {
	// 	return null
	// };
// * notes:
// - need to figure out a way to ensure the pics submitted render onto a new spot
//	- ensure all errors are erroring correctly
// - include short circuits

	return (
		<form onSubmit={handleSubmit} className="create-form">
			<h2>
				Create a new Spot
				{formType}
			</h2>
			<div className="create-form-locale">
				<div className="create-form-header-text">
					<h3>
						Where's your place located?
					</h3>
					<p>Guests will only get your exact address once they booked a
						reservation.
					</p>
				</div>
				<div className="form-country">
					<label htmlFor="country">
						Country
						<input type="text" name="country" id="country" placeholder="Country" required />
					</label>
				</div>
				<div className="form-address">
					<label htmlFor="address">
						Street Address
						<input type="text" name="address" id="address" placeholder="Address" required />
					</label>
				</div>
				<div className="form-city-state">
					<label htmlFor="city">
						City
						<input type="text" name="city" id="city" placeholder="City" required />
					</label>
					,
					<label htmlFor="state">
						State
						<input type="text" name="state" id="state" placeholder="STATE" required />
					</label>
				</div>
			</div>
			<hr />
			<div className="form-description">
				<h3>
					Describe your place to guests
				</h3>
				<p>
					Mention the best features of your space, any special amenities like
					fast wifi or parking, and what you love about the neighborhood.
				</p>
				<textarea name="" id="" cols="30" rows="10" placeholder="Please write at least 30 characters"></textarea>
			</div>
			<hr />
			<div className="form-title">
				<h3>Create a title for your spot</h3>
				<p>
					Catch guests' attention with a spot title that highlights what makes
					your place special.
				</p>
				<input type="text" name="title" id="title" placeholder="Name of your spot" />
			</div>
			<hr />
			<div className="form-price">
				<h3>Set a base price for your spot</h3>
				<p>
					Competitive pricing can help your listing stand out and rank higher
					in search results.
				</p>
				$ <input type="text" name="price" id="price" placeholder="Price per night (USD)" />
			</div>
			<hr />
			<div className="spot-pics">
				<h3>Liven up your spot with photos</h3>
				<p>Submit a link to at least one photo to publish your spot.</p>
				<input type="text" name="preview-img" id="preview-img" placeholder="Preview Image URL" />
				<input type="text" name="img-one" className="spot-form-img" id="img-one" placeholder="Image URL" />
				<input type="text" name="img-two" className="spot-form-img" id="img-two" placeholder="Image URL" />
				<input type="text" name="img-three" className="spot-form-img" id="img-three" placeholder="Image URL" />
				<input type="text" name="img-four" className="spot-form-img" id="img-four" placeholder="Image URL" />
			</div>
			<hr />
			<button type="submit" className="spot-create-form-btn">Create Spot</button>
		</form>
	)
}


export default CreateSpotForm;
