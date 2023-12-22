import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { thunkCreateSpot } from "../../../store/spot";
import './CreateSpotForm.css';


function CreateSpotForm({ spot, formType }) {
	console.log("🚀 ~ file: CreateSpotForm.jsx:5 ~ CreateSpotForm ~ spot:", spot)
	//!  no such route w new so how to render? - will try to make a modal...? or create a url
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [country, setCountry] = useState('');
	const [address, setAddress] = useState('');
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [describeText, setDescribeText] = useState('');
	const [title, setTitle] = useState('');
	const [price, setPrice] = useState('');
	const [mainImage, setMainImage] = useState('');
	const [otherImage, setOtherImage] = useState('');

	const [errors, setErrors] = useState({});


	useEffect(() => {
		const errorsObject = {};

		country.length < 3 ? errorsObject.country = "Country is required" : country;
		address.length < 10 ? errorsObject.address = "Address is required" : address;
		city.length < 4 ? errorsObject.city = "City is required" : city;
		state.length < 2 ? errorsObject.state = "State is required" : state;
		describeText.length < 30 ? errorsObject.describeText = "Description needs a minimum of 30 characters" : describeText;
		title.length < 5 ? errorsObject.title = "Name is required" : title;
		price.length === 0 ? errorsObject.price = "Price is required" : price;
		mainImage.length === 0 || !mainImage.includes(".jpg") || !mainImage.includes(".png") || !mainImage.includes(".jpeg") ? errorsObject.mainImage = "Preview image is required." : mainImage;
		otherImage.length === 0 || !otherImage.includes(".jpg") || !otherImage.includes(".png") || !otherImage.includes(".jpeg") ? errorsObject.otherImage = "Image URL must end in .png, .jpg, or .jpeg" : otherImage;

		setErrors(errorsObject);


	}, [country, address, city, state, describeText, title, price, mainImage, otherImage]);


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
			<div className="create-form-container">

				<h2 id="create-form-h2">
					Create a new Spot
					{formType}
				</h2>
				<div className="create-form-locale">
					<div className="create-form-header">
						<h3 className="create-form-h3">
							Where&apos;s your place located?
						</h3>
						<div className="form-text-div">Guests will only get your exact address once they booked a reservation.
						</div>
					</div>

					<div className="form-locale form-country">
						<label htmlFor="country">
							Country
							<input type="text" name="country" id="country" placeholder="Country"
								value={country}
								onChange={(e) => setCountry(e.target.value)}
								required />
						</label>
						{"country" in errors && <p className="p-error">{errors.country}</p>}
					</div>

					<div className="form-locale form-address">
						<label htmlFor="address">
							Street Address
							<input type="text" name="address" id="address" placeholder="Address"
								value={address}
								onChange={(e) => setAddress(e.target.value)}
								required />
						</label>
						{"address" in errors && <p className="p-error">{errors.address}</p>}
					</div>

					<div className="form-locale form-city-state">
						<div className="form-city-state-container" id="city-container">
							<label htmlFor="city">
								City
							</label>
							<input type="text" name="city" id="city" className="form-label city" placeholder="City"
								value={city}
								onChange={(e) => setCity(e.target.value)}
								required />
							{"city" in errors && <p className="p-error">{errors.city}</p>}
						</div>
						<span id="comma">,</span>

						<div className="form-city-state-container" id="state-container">
							<label htmlFor="state">
								State
							</label>
							<input type="text" name="state" id="state" className="form-label state" placeholder="STATE"
								value={state}
								onChange={(e) => setState(e.target.value)}
								required />
							{"state" in errors && <p className="p-error">{errors.state}</p>}
						</div>

					</div>
				</div>

				<hr />

				<div className="form-description">
					<div className="create-form-header">
						<h3 className="create-form-h3">
							Describe your place to guests
						</h3>
						<div className="form-text-div">
							Mention the best features of your space, any special amenities like
							fast wifi or parking, and what you love about the neighborhood.
						</div>
					</div>
					<textarea name="" id="" cols="50" rows="10" placeholder="Please write at least 30 characters"
						value={describeText}
						onChange={(e) => setDescribeText(e.target.value)}
					></textarea>
					{"describeText" in errors && <p className="p-error">{errors.describeText}</p>}
				</div>

				<hr />

				<div className="form-title">
					<div className="create-form-header">
						<h3 className="create-form-h3">Create a title for your spot</h3>
						<div className="form-text-div">
							Catch guests&apos; attention with a spot title that highlights what makes
							your place special.
						</div>
					</div>
					<input type="text" name="title" id="title" placeholder="Name of your spot"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					{"title" in errors && <p className="p-error">{errors.title}</p>}
				</div>

				<hr />

				<div className="form-price">
					<div className="create-form-header">
						<h3 className="create-form-h3">Set a base price for your spot</h3>
						<div className="form-text-div">
							Competitive pricing can help your listing stand out and rank higher
							in search results.
						</div>
					</div>
					<div className="price-container">
						<span>$</span>
						<input type="text" name="price" id="price" placeholder="Price per night (USD)"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
						/>
						{"price" in errors && <p className="p-error">{errors.price}</p>}

					</div>
				</div>

				<hr />

				<div className="spot-pics">
					<div className="create-form-header">
						<h3>Liven up your spot with photos</h3>
						<p>Submit a link to at least one photo to publish your spot.</p>
					</div>
					<input type="text" name="preview-img" id="preview-img" placeholder="Preview Image URL"
						value={mainImage}
						onChange={(e) => setMainImage(e.target.value)}

					/>
					{"mainImage" in errors && <p className="p-error">{errors.mainImage}</p>}

					<input type="text" name="img-one" className="spot-form-img" id="img-one" placeholder="Image URL"
						value={otherImage}
						onChange={(e) => setOtherImage(e.target.value)}
					/>
					{"otherImage" in errors && <p className="p-error">{errors.otherImage}</p>}

					<input type="text" name="img-two" className="spot-form-img" id="img-two" placeholder="Image URL" />
					<input type="text" name="img-three" className="spot-form-img" id="img-three" placeholder="Image URL" />
					<input type="text" name="img-four" className="spot-form-img" id="img-four" placeholder="Image URL" />
				</div>
				<hr />
			</div>
			<button type="submit" className="spot-create-form-btn">Create Spot</button>

		</form>
	)
}


export default CreateSpotForm;
