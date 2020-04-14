import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Gioco from "./Gioco.js";

function App() {
	return (
		<Router>
			<div className="App">
				<div className="contenitore-principale">
					<div className="cerchio" id="cerchio-tl"></div>
					<div className="cerchio" id="cerchio-tr"></div>
					<div className="cerchio" id="cerchio-bl"></div>
					<div className="cerchio" id="cerchio-br"></div>
					<div className="contenuto"></div>
					<Switch>
						<Route path="/room/:id" component={Gioco}></Route>
						<Route path="/"></Route>
					</Switch>
				</div>
			</div>
		</Router>
	);
}

export default App;
