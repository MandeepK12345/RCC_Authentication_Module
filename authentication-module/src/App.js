// import logo from './logo.svg';
import "./App.css";
import { BrowserRouter } from "react-router-dom";

import RoutesWrapper from "./Router";

function App() {
	return (
		<BrowserRouter>
			<RoutesWrapper />
		</BrowserRouter>
	);
}

export default App;
