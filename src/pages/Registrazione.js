import React from "react";
import logo from "../img/iqfight-logo.png";
import "./Registrazione.css";
import FormRegistrazione from "../components/FormRegistrazione.js";

class Registrazione extends React.Component {
	render() {
		return (
			<div className="row h-100 registrazione">
				<div className="col-12 col-sm-6 d-flex justify-content-center align-items-center">
					<img src={logo} alt="Logo" className="iqfight-logo"></img>
				</div>
				<div className="col-12 col-sm-6 d-flex justify-content-center align-items-center">
					<FormRegistrazione></FormRegistrazione>
				</div>
			</div>
		);
	}
}

export default Registrazione;
