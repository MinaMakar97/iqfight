import React, { Component } from "react";
import "./MenuLaterale.css";
import { withRouter } from "react-router-dom";
import avatarPredefinito from "../img/user.png";

class MenuLaterale extends Component {
	constructor(props) {
		super(props);
		this.state = { aperto: !(window.innerWidth <= 576), username: null, avatar: null, lista: [] };
		this.setta = this.setta.bind(this);
		this.cambiaPagina = this.cambiaPagina.bind(this);
		this.sezioniMenu = this.sezioniMenu.bind(this);
		this.esci = this.esci.bind(this);
		this.sezioni = ["Classifica", "Gioca"];
	}

	aggiungiCard(stringa) {
		return (
			<div>
				<div className="div-content" key={stringa} id={stringa.replace(" ", "-").toLowerCase()} onClick={this.cambiaPagina}>
					{stringa}
				</div>
				<hr className="riga-menu" key={"riga-" + stringa}></hr>
			</div>
		);
	}

	setta() {
		this.setState((prevState) => ({
			aperto: !prevState.aperto,
		}));
	}

	sezioniMenu() {
		let lista = [];
		for (let sez of this.sezioni) {
			lista.push(this.aggiungiCard(sez));
		}
		if (this.state.username !== null) lista.push(this.aggiungiCard("Aggiungi domanda"), this.aggiungiCard("Esci"));
		return lista;
	}

	esci() {
		let xml = new XMLHttpRequest();
		xml.open("DELETE", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/login.php");
		xml.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				let json = JSON.parse(e.target.responseText);
				if (json["successo"] === true) {
					window.location.replace("/");
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
		let path = this.props.location.pathname.slice(1);
		if (!path) path = "gioca";
		const elementoSezione = document.getElementById(path);
		if (elementoSezione) {
			elementoSezione.style.backgroundColor = "#0996BB";
			this.sezione = elementoSezione;
		}

		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				let json = JSON.parse(e.target.responseText);
				if (json["successo"] === true) {
					this.setState({ username: json["username"], avatar: json["avatar"] });
				}
			}
		};
		xhr.withCredentials = true;
		xhr.open("GET", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/info-utente.php");
		xhr.send();
	}

	render() {
		return (
			<div id="div-menu-laterale" style={{ transform: "translateX(" + (this.state.aperto ? "0px" : "-100%") + ")" }}>
				<div id="menu-laterale">
					{this.state.username ? (
						<div>
							<hr className="riga-menu"></hr>
							<div className="div-content centra">
								<img
									alt="Avatar utente"
									src={this.state.avatar || avatarPredefinito}
									style={{ width: "40px", borderRadius: "100%" }}></img>
								<p style={{ marginBottom: 0 }}>{this.state.username}</p>
							</div>
						</div>
					) : null}
					<hr className="riga-menu"></hr>
					{this.sezioniMenu()}
				</div>
				<div className="menu-button" onClick={this.setta}>
					<p id="freccia" className={this.state.aperto ? "arrow-right" : "arrow-left"}></p>
				</div>
			</div>
		);
	}
}

export default withRouter(MenuLaterale);
