import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";


function SpotPage() {



	if (!spot || spot.Owner) {
		return null
	};

	return (
		<h1>hello</h1>
	)
}


export default SpotPage;
