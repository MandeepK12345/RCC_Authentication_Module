import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RoutesWrapper from "./router";

function App() {
	return (
		<div className="App">
			<ToastContainer />
			<BrowserRouter>
				<RoutesWrapper />
			</BrowserRouter>
		</div>
	);
}

export default App;
