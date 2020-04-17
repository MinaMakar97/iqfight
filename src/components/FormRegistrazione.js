import React from "react";
import TitleBox from "../components/TitleBox";
import "./FormRegistrazione.css";

class FormRegistrazione extends React.Component {
	render() {
		return (
			<div className="form-registrazione">
				<TitleBox titolo="Registrati" className="shadow w-75"></TitleBox>
				<input className="form-control shadow" type="text" placeholder="Nome"></input>
				<input className="form-control shadow" type="text" placeholder="Cognome"></input>
				<input className="form-control shadow" type="text" placeholder="Nickname"></input>
				<input className="form-control shadow" type="email" placeholder="Email"></input>
				<input className="form-control shadow" type="password" placeholder="Password"></input>
				<input type="submit" value="Conferma" className="btn btn-primary shadow"></input>
			</div>
		);
	}
}

export default FormRegistrazione;
