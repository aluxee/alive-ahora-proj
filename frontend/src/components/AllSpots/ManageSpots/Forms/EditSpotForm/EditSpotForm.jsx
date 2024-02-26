import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { thunkEditSpot, thunkReceiveSpot } from "../../../../../store/spot";

import './EditSpotForm.css';



function EditSpotForm({ formType }) {

	// console.log("%c 🚀 ~ file: EditSpotForm.jsx:11 ~ EditSpotForm ~ props: ", "color: red; font-size: 25px", props)

	// console.log("%c 🚀 ~ file: EditSpotForm.jsx:12 ~ EditSpotForm ~ spot: ", "color: white; font-size: 25px", spot)

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { spotId } = useParams();

	// console.log("%c 🚀 ~ file: EditSpotForm.jsx:17 ~ EditSpotForm ~ spotId: ", "color: yellow; font-size: 25px", spotId)

	// console.log("%c 🚀 ~ file: EditSpotForm.jsx:20 ~ EditSpotForm ~ id: ", "color: yellow; font-size: 25px", id)
	const spot = useSelector(state => state.spots[spotId]);
	// console.log("%c 🚀 ~ file: EditSpotForm.jsx:21 ~ EditSpotForm ~ spot:(only off currentSpots route to update button) ", "color: orange; font-size: 25px", spot)


	// console.log("%c 🚀 ~ file: EditSpotForm.jsx:20 ~ EditSpotForm ~ spotId: ", "color: red; font-size: 25px", spotId)
	const prevSpot = spot;

	// console.log("%c 🚀 ~ file: EditSpotForm.jsx:19 ~ EditSpotForm ~ prevSpot: ", "color: red; font-size: 25px", prevSpot);

	const [country, setCountry] = useState('');
	const [address, setAddress] = useState('');
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [description, setDescription] = useState('');
	const [name, setName] = useState('');
	const [price, setPrice] = useState('');
	const [prevMainImage, setPrevMainImage] = useState('');
	const [otherImage, setOtherImage] = useState('');
	const [otherImage2, setOtherImage2] = useState('');
	const [otherImage3, setOtherImage3] = useState('');
	const [otherImage4, setOtherImage4] = useState('');
	const [errors, setErrors] = useState({});



	useEffect(() => {
		const errorsObject = {};

		country.length < 3 ? errorsObject.country = "Country is required" : country;
		address.length < 10 ? errorsObject.address = "Address is required" : address;
		city.length < 4 ? errorsObject.city = "City is required" : city;
		state.length < 2 ? errorsObject.state = "State is required" : state;
		description.length < 30 ? errorsObject.description = "Description needs a minimum of 30 characters" : description;
		name.length < 5 ? errorsObject.name = "Name is required" : name;
		price.length === 0 ? errorsObject.price = "Price is required" : price;
		if (isNaN(Number(price))) errorsObject.price = "Valid price is required";


		if (prevMainImage?.length === 0 || otherImage?.length === 0) {

			prevMainImage.length === 0 || !prevMainImage.includes(".jpg") || !prevMainImage.includes(".png") || !prevMainImage.includes(".jpeg") ? errorsObject.prevMainImage = "Preview image is required." : prevMainImage;
			otherImage.length === 0 || !otherImage.includes(".jpg") || !otherImage.includes(".png") || !otherImage.includes(".jpeg") ? errorsObject.otherImage = "Image URL must end in .png, .jpg, or .jpeg" : otherImage;
		}
		setErrors(errorsObject);



	}, [country, address, city, state, description, name, price, prevMainImage, otherImage]);

	useEffect(() => {
		dispatch(thunkReceiveSpot(spotId))

	}, [dispatch, spotId]);

	useEffect(() => {
		if (prevSpot) {

			setAddress(prevSpot.address);
			setCity(prevSpot.city);
			setCountry(prevSpot.country);
			setState(prevSpot.state);
			setDescription(prevSpot.description);
			setName(prevSpot.name);
			setPrice(prevSpot.price);

			// console.log("inside of the EDITS: prevSpot =====>", prevSpot, "this is prior to the edits to the images and their url");
			let mainImage = prevSpot.SpotImages?.find(img => img.preview === true);

			// console.log("%c 🚀 ~ file: EditSpotForm.jsx:98 ~ useEffect ~ mainImage: ", "color: red; font-size: 25px", mainImage)
			let otherImages = prevSpot.SpotImages?.filter(img => img.preview === false);

			// console.log("%c 🚀 ~ file: EditSpotForm.jsx:101 ~ useEffect ~ otherImages: ", "color: red; font-size: 25px", otherImages)

			//* will need some fixing, does not update but update of pics is not required
			setPrevMainImage(mainImage ? mainImage.url : "");
			if (otherImages) {

				setOtherImage(otherImages ? otherImages.url : "");
			}
			// setOtherImage2(otherImages[1] ? otherImages[1].url : "");
			// setOtherImage3(otherImages[2] ? otherImages[2].url : "");
			// setOtherImage4(otherImages[3] ? otherImages[3].url : "");
		}
	}, [prevSpot])


	const handleSubmit = async (e) => {
		e.preventDefault();


		if (formType === 'Edit Spot') {
			const updatedSpot = {

				country, address, city, state,
				lat: 0,
				lng: 0,
				name,
				price,
				description

			}

			console.log("🚀 ~ file: EditSpotForm.jsx:141 ~ handleSubmit ~ SPOT INSIDE editSpotForm:", spot)

			const submissionResults = await dispatch(thunkEditSpot(spotId, updatedSpot));
			// console.log("%c 🚀 ~ file: EditSpotForm.jsx:141 ~ handleSubmit ~ submissionResults: ", "color: green; font-size: 25px", submissionResults)

			if (!submissionResults.errors && submissionResults) {
				// console.log("SUBMISSION ID: ", submissionResults.id)
				navigate(`/spots/${submissionResults.id}`)
			} else {
				return submissionResults.errors
			}

		}
	}


	const stylishComma = () => {

		if (errors.city || errors.state) {
			return <div id="comma"
				style={{
					alignSelf: 'center',
					marginInlineStart: "-4.5rem"

				}}>
				,
			</div>
		} else if (!errors.city && !errors.state) {
			return <div id="comma"
				style={{
					alignSelf: "end",
					marginBlockEnd: "0.6rem",
					marginInlineStart: "-5.0rem"
				}}>
				,
			</div>

		} else {
			return <div id="comma"
				style={{
					alignSelf: 'end',
					marginBlockEnd: 10,
					marginInlineEnd: 60

				}}
			>
				,
			</div>
		}
	}



	if (!prevSpot || !Object.values(prevSpot).length) return null;

	return (
		<>
			<div className="form-outer-container">
				<div className="form-inner-container">
					<form
						onSubmit={handleSubmit}
						className="edit-form">
						<div className="edit-form-container">

							<h2 id="edit-form-h2">
								Update Your Spot
							</h2>
							<div className="edit-form-locale">
								<div className="edit-form-header">
									<h3 className="edit-form-h3">
										Where&apos;s your place located?
									</h3>
									<div className="form-text-div">Guests will only get your exact address once they booked a reservation.
									</div>
								</div>

								<div className="form-locale form-country" id="form-country">
									<label htmlFor="country">
										Country
										<input type="text" name="country" id="country" placeholder="Country"
											value={country}
											onChange={(e) => setCountry(e.target.value)}
											required />
									</label>
									<p className="p-error">{errors?.country}</p>
								</div>

								<div className="form-locale form-address" id="form-address">
									<label htmlFor="address">
										Street Address
										<input type="text" name="address" id="address" placeholder="Address"
											value={address}
											onChange={(e) => setAddress(e.target.value)}
											required />
									</label>
									<p className="p-error">{errors?.address}</p>
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
										<p className="p-error">{errors?.city}</p>
									</div>

									{stylishComma()}

									<div className="form-city-state-container" id="state-container">
										<label htmlFor="state">
											State
										</label>
										<input type="text" name="state" id="state" className="form-label state" placeholder="STATE"
											value={state}
											onChange={(e) => setState(e.target.value)}
											required />
										<p className="p-error">{errors?.state}</p>
									</div>

								</div>
							</div>

							<hr />

							<div className="form-description">
								<div className="edit-form-header">
									<h3 className="edit-form-h3">
										Describe your place to guests
									</h3>
									<div className="form-text-div">
										Mention the best features of your space, any special amenities like
										fast wifi or parking, and what you love about the neighborhood.
									</div>
								</div>
								<textarea name="" id="" cols="50" rows="10" placeholder="Please write at least 30 characters"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
								></textarea>
								<p className="p-error">{errors?.description}</p>
							</div>

							<hr />

							<div className="form-name">
								<div className="edit-form-header">
									<h3 className="edit-form-h3">Create a name for your spot</h3>
									<div className="form-text-div">
										Catch guests&apos; attention with a spot name that highlights what makes
										your place special.
									</div>
								</div>
								<input type="text" name="name" id="name" placeholder="Name of your spot"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
								<p className="p-error">{errors?.name}</p>
							</div>

							<hr />

							<div className="form-price">
								<div className="edit-form-header">
									<h3 className="edit-form-h3">Set a base price for your spot</h3>
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
									<p className="p-error">{errors?.price}</p>

								</div>
							</div>

							<hr />

							<div className="spot-pics">
								<div className="edit-form-header">
									<h3>Liven up your spot with photos</h3>
									<p>Submit a link to at least one photo to publish your spot.</p>
								</div>
								<input type="text" name="preview-img" id="preview-img" placeholder="Preview Image URL"
									value={prevMainImage}
									onChange={(e) => setPrevMainImage(e.target.value)}

								/>
								<p className="p-error">{errors?.prevMainImage}</p>

								<input type="text" name="img-one" className="spot-form-img" id="img-one" placeholder="Image URL"
									value={otherImage}
									onChange={(e) => setOtherImage(e.target.value)}
								/>
								<p className="p-error">{errors?.otherImage}</p>

								<input type="text" name="img-two" className="spot-form-img" id="img-two" placeholder="Image URL"
									value={otherImage2}
									onChange={(e) => setOtherImage2(e.target.value)}
								/>
								<input type="text" name="img-three" className="spot-form-img" id="img-three" placeholder="Image URL"
									value={otherImage3}
									onChange={(e) => setOtherImage3(e.target.value)}
								/>
								<input type="text" name="img-four" className="spot-form-img" id="img-four" placeholder="Image URL"
									value={otherImage4}
									onChange={(e) => setOtherImage4(e.target.value)}
								/>
							</div>
							<hr />
						</div>
						<button
							type="submit"
							className="spot-edit-form-btn"
							disabled={Object.values(errors).length > 0}
						>
							Create Spot
						</button>

					</form>
				</div>
			</div>
		</>

	)
}


export default EditSpotForm;
