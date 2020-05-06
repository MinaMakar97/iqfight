import React, { Component } from "react";
import "./MenuLaterale.css";
import { withRouter } from "react-router-dom";

class MenuLaterale extends Component {
	constructor(props) {
		super(props);
		this.state = { aperto: !(window.innerWidth <= 576) };
		this.setta = this.setta.bind(this);
		this.cambiaPagina = this.cambiaPagina.bind(this);
		this.esci = this.esci.bind(this);
		this.sezioni = ["Guida", "Classifica", "Gioca", "Aggiungi domanda", "Esci"];
		this.lista = [];

		for (let sez of this.sezioni) {
			this.lista.push(
				<div className="div-content" key={sez} id={sez.replace(" ", "-").toLowerCase()} onClick={this.cambiaPagina}>
					{sez}
				</div>
			);
			this.lista.push(<hr className="riga-menu" key={"riga-" + sez}></hr>);
		}
	}

	setta() {
		this.setState((prevState) => ({
			aperto: !prevState.aperto,
		}));
	}

	esci() {
		let xml = new XMLHttpRequest();
		xml.open("DELETE", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/login.php");
		xml.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				let json = JSON.parse(e.target.responseText);
				if (json["successo"] === true) {
					this.props.history.push("/login");
				}
			}
		};
		xml.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xml.withCredentials = true;
		xml.send();
	}

	cambiaPagina(e) {
		if (e.target.id === "esci") this.esci();
		else {
			this.props.history.push("/" + e.target.getAttribute("id"));
			if (this.sezione) this.sezione.style.backgroundColor = "unset";
			e.target.style.backgroundColor = "#0996BB";
			this.sezione = e.target;
			if (window.innerWidth <= 576) this.setta();
		}
	}

	componentDidMount() {
		const path = this.props.location.pathname.slice(1);
		const elementoSezione = document.getElementById(path);
		if (elementoSezione) {
			elementoSezione.style.backgroundColor = "#0996BB";
			this.sezione = elementoSezione;
		}
	}

	render() {
		return (
			<div id="div-menu-laterale" style={{ transform: "translateX(" + (this.state.aperto ? "0px" : "-100%") + ")" }}>
				<div id="menu-laterale">
					<hr className="riga-menu"></hr>
					{this.lista}
				</div>
				<div className="menu-button" onClick={this.setta}>
					<p id="freccia" className={this.state.aperto ? "arrow-right" : "arrow-left"}></p>
				</div>
			</div>
		);
	}
}

export default withRouter(MenuLaterale);
