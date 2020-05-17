import React from "react";
import Login from "../components/Login.js";
import FormRegistrazione from "../components/FormRegistrazione.js";
import "./Home.css";
import logo from "../img/iqfight-logo.png";
import { Switch, Route } from "react-router-dom";

class Home extends React.Component {
	render() {
		return (
			<div className="row w-100">
				<div className="col-12 col-sm-5 flex-column centra">
					<img src={logo} width="70%" className="iqfight-logo" alt="logo" />
					<p className="descrizione mt-sm-5">Sfida i tuoi amici in una competizione su chi ne sa di più!</p>
				</div>
				<div className="col-12 col-sm-1">
					<hr className="riga"></hr>
				</div>
				<div className="col-12 col-sm-6">
					<Switch>
						<Route path="/login" component={Login}></Route>
						<Route path="/registrazione" component={FormRegistrazione}></Route>
					</Switch>
				</div>
			</div>
		);
	}
}
export default Home;
