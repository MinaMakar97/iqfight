import React, { Component } from "react";
import "./MenuLaterale.css";
import { withRouter } from "react-router-dom";

class MenuLaterale extends Component {
	constructor(props) {
		super(props);
		this.state = { aperto: !(window.innerWidth <= 576) };
		this.setta = this.setta.bind(this);
		this.cambiaPagina = this.cambiaPagina.bind(this);
		this.sezione = null;
		this.sezioni = ["Guida", "Classifica", "Gioca", "Aggiungi Domanda", "Esci"];
	}

	setta() {
		this.setState((prevState) => ({
			aperto: !prevState.aperto,
		}));
	}

	cambiaPagina(e) {
		this.props.history.push("/" + e.target.getAttribute("id"));
		if (this.sezione) this.sezione.style.backgroundColor = "unset";
		e.target.style.backgroundColor = "#0996BB";
		this.sezione = e.target;
		if (window.innerWidth <= 576) this.setta();
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

					<div className="div-content" id="guida" onClick={this.cambiaPagina}>
						Guida
					</div>

					<hr className="riga-menu"></hr>

					<div className="div-content" id="classifica" onClick={this.cambiaPagina}>
						Classifica
					</div>

					<hr className="riga-menu"></hr>

					<div className="div-content" id="gioca" onClick={this.cambiaPagina}>
						Gioca
					</div>

					<hr className="riga-menu"></hr>

					<div className="div-content" id="aggiungi-domanda" onClick={this.cambiaPagina}>
						Aggiungi Domanda
					</div>

					<hr className="riga-menu"></hr>

					<div className="div-content" id="esci" onClick={this.cambiaPagina}>
						Esci
					</div>

					<hr className="riga-menu"></hr>
				</div>
				<div className="menu-button" onClick={this.setta}>
					<p id="freccia" className={this.state.aperto ? "arrow-right" : "arrow-left"}></p>
				</div>
			</div>
		);
	}
}

export default withRouter(MenuLaterale);
