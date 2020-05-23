import React, { Component } from "react";
import "./MenuLaterale.css";
import { withRouter } from "react-router-dom";
import avatarPredefinito from "../img/user.png";
import Toggle from "./Toggle";
class MenuLaterale extends Component {
	constructor(props) {
		super(props);
		this.state = { aperto: !(window.innerWidth <= 576), username: null, avatar: null, lista: [], checked: null };
		this.setta = this.setta.bind(this);
		this.cambiaPagina = this.cambiaPagina.bind(this);
		this.sezioniMenu = this.sezioniMenu.bind(this);
		this.esci = this.esci.bind(this);
		this.onChange = this.onChange.bind(this);
		this.sezioni = ["Classifica", "Gioca"];
	}

	aggiungiCard(stringa) {
		return (
			<div key={stringa}>
				<div className="div-content" id={stringa.replace(" ", "-").toLowerCase()} onClick={this.cambiaPagina}>
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
			let element = e.target;
			if (!element.id) element = element.parentElement;
			this.props.history.push("/" + element.id);
			if (this.sezione) this.sezione.style.backgroundColor = null;
			element.style.backgroundColor = "#0996BB";
			this.sezione = element;
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
					this.setState({
						username: json["username"],
						avatar: json["avatar"] != null ? process.env.REACT_APP_LOCAL_ENDPOINT + json["avatar"] : null,
						checked: json["dark"],
					});
					this.state.checked === 1 ? this.darkMode() : this.normalMode();
				}
			}
		};
		xhr.withCredentials = true;
		xhr.open("GET", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/info-utente.php");
		xhr.send();
	}

	onChange(e) {
		console.log(e.target.checked);
		this.setState({
			checked: e.target.checked,
		});
		if (e.target.checked) {
			this.darkMode();
		} else {
			this.normalMode();
		}
		if (this.state.username !== null) {
			let xhr = new XMLHttpRequest();
			let json = { dark: e.target.checked };
			xhr.open("PUT", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/info-utente.php");
			xhr.withCredentials = true;
			xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			xhr.send(JSON.stringify(json));
		}
	}

	normalMode() {
		document.documentElement.style.setProperty("--colore-primario", null);
		document.documentElement.style.setProperty("--colore-secondario", null);
		document.documentElement.style.setProperty("--colore-card", null);
		document.documentElement.style.setProperty("--colore-quart", null);
		document.documentElement.style.setProperty("--colore-contorno", null);
		document.documentElement.style.setProperty("--colore-terz", null);
		document.documentElement.style.setProperty("--colore-border", null);
		document.documentElement.style.setProperty("--colore-scritte", null);
		document.documentElement.style.setProperty("--colore-placeholder", null);
	}

	darkMode() {
		document.documentElement.style.setProperty("--colore-primario", "#2f3477");
		document.documentElement.style.setProperty("--colore-secondario", "#484848");
		document.documentElement.style.setProperty("--colore-card", "#b9b8b8");
		document.documentElement.style.setProperty("--colore-terz", "#717171");
		document.documentElement.style.setProperty("--colore-quart", "white");
		document.documentElement.style.setProperty("--colore-contorno", "#00000033");
		document.documentElement.style.setProperty("--colore-border", "#424242");
		document.documentElement.style.setProperty("--colore-scritte", "#2f3477");
		document.documentElement.style.setProperty("--colore-placeholder", "white");
	}

	render() {
		return (
			<div id="div-menu-laterale" style={{ transform: "translateX(" + (this.state.aperto ? "0px" : "-100%") + ")" }}>
				<div id="menu-laterale">
					{this.state.username ? (
						<div>
							<hr className="riga-menu"></hr>
							<div className="div-content centra" onClick={this.cambiaPagina} id={"profilo"}>
								<img
									alt="Avatar utente"
									src={this.state.avatar || avatarPredefinito}
									style={{ width: "50px", height: "50px", borderRadius: "100%" }}></img>
								<p style={{ marginBottom: 0 }}>{this.state.username}</p>
							</div>
						</div>
					) : null}
					<hr className="riga-menu"></hr>
					{this.sezioniMenu()}
					<div className="pos-toggle centra flex-column" style={{ height: "5em" }}>
						<Toggle name={"dark"} onClick={this.onChange} checked={this.state.checked}></Toggle>
						<div className="pt-1">Dark mode</div>
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
