import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MenuLaterale from "./components/Menulaterale.js";
import Login from "./pages/Home.js";
import AggiungiDomanda from "./pages/AggiungiDomanda.js";
import Gioca from "./pages/Gioca.js";
import Classifica from "./pages/Classifica";
import CreaStanza from "./pages/CreaStanza";
import SalaAttesa from "./pages/SalaAttesa.js";

class App extends Component {
	render() {
		return (
			<div className="container-fluid contenitore-principale p-4">
				<div className="cerchio rounded-circle m-3" id="cerchio-tl"></div>
				<div className="cerchio rounded-circle m-3" id="cerchio-tr"></div>
				<div className="cerchio rounded-circle m-3" id="cerchio-bl"></div>
				<div className="cerchio rounded-circle m-3" id="cerchio-br"></div>
				<div className="container-fluid contenuto p-3 p-md-4">
					<Router>
						<MenuLaterale></MenuLaterale>
						<Switch>
							<Route path="/login" component={Login}></Route>
							<Route path="/registrazione" component={Login}></Route>
							<Route path="/aggiungi-domanda" component={AggiungiDomanda}></Route>
							<Route path="/gioca" component={SalaAttesa}></Route>
							{/* {<Route path="/room/:id" component={Gioco}></Route>} */}
							<Route path="/crea-stanza" component={CreaStanza}></Route>
							<Route path="/classifica" component={Classifica}></Route>
						</Switch>
					</Router>
				</div>
			</div>
		);
	}
}

export default App;
