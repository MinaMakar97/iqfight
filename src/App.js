import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Gioco from "./pages/Gioco.js";
import TitleBox from "./components/TitleBox.js"

function App() {

	return (
		<Router>
			<div className="container-fluid sfondo p-4 p-lg-5">
				<div className="container-fluid contenitore-principale p-4">
					<div className="cerchio rounded-circle m-3" id="cerchio-tl"></div>
					<div className="cerchio rounded-circle m-3" id="cerchio-tr"></div>
					<div className="cerchio rounded-circle m-3" id="cerchio-bl"></div>
					<div className="cerchio rounded-circle m-3" id="cerchio-br"></div>
					<div className="container-fluid contenuto p-3 p-md-4">
					<TitleBox titolo="Login"></TitleBox>
						{/* <Switch>
							<Route path="/room/:id" component={Gioco}></Route>
							<Route path="/"></Route>
						</Switch> */}
					</div>
				</div>
			</div>
		</Router>
	);
}

export default App;
