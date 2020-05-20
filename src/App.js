import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MenuLaterale from "./components/Menulaterale.js";
import AggiungiDomanda from "./pages/AggiungiDomanda.js";
import Gioco from "./pages/Gioco.js";
import Classifica from "./pages/Classifica";
import Gioca from "./pages/Gioca";
import Home from "./pages/Home.js";
import withAuth from "./components/withAuth";
import CreaStanza from "./pages/CreaStanza";
import InfoUtente from "./pages/InfoUtente";
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
							<Route path="/login" component={Home}></Route>
							<Route path="/registrazione" component={Home}></Route>
							<Route path="/aggiungi-domanda" component={withAuth(AggiungiDomanda)}></Route>
							<Route path="(/|/gioca)" component={withAuth(Gioca)}></Route>
							<Route path="/crea-stanza" component={withAuth(CreaStanza)}></Route>
							<Route path="/room/:id" component={withAuth(Gioco)}></Route>
							<Route path="/classifica" component={Classifica}></Route>
							<Route path="/profilo" component={withAuth(InfoUtente)}></Route>
						</Switch>
					</Router>
				</div>
			</div>
		);
	}
}

export default App;
