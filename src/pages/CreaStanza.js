import React, { Component } from "react";
import Logo from "../img/iqfight-logo.png";
import Toggle from "../components/Toggle";
import "./CreaStanza.css";

export default class CreaStanza extends Component {
	constructor(props) {
		super(props);
		this.mappaColori = {
			Arte: "#f991c3",
			Geografia: "#7FDBFF",
			Giochi: "#AAAAAA",
			Informatica: "#0074D9",
			Lingue: "#FF4136",
			Scienze: "#3BB347",
			Spettacolo: "#9c7abe",
			Storia: "#FF851B",
		};
		this.creaStanza = this.creaStanza.bind(this);
	}

	creaStanza(e) {
		e.preventDefault();
		const form = e.target;
		let json = { nome: form.nomeStanza.value, privata: form.privata.checked, categoria: form.categoria.value };
		let xml = new XMLHttpRequest();
		xml.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				let json2 = JSON.parse(e.target.responseText);
				if (json2["successo"] === true) window.location.replace("/room/" + json2["idStanza"]);
			}
		};
		xml.open("POST", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/stanza.php");
		xml.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xml.withCredentials = true;
		xml.send(JSON.stringify(json));
	}

	render() {
		const categorie = [];
		categorie.push(<input type="radio" name="categoria" className="d-none" id="casuale" key="casuale" value="casuale"></input>);
		categorie.push(
			<label className="categoria centra domande-casuali" htmlFor="casuale" key="lab-casuale">
				Domande Casuali
				<br />
				Classificata
			</label>
		);
		for (let key in this.mappaColori) {
			categorie.push(<input type="radio" name="categoria" className="d-none" id={key} key={"lab-" + key} value={key}></input>);
			categorie.push(
				<label className="categoria centra" style={{ backgroundColor: this.mappaColori[key] }} htmlFor={key} key={key}>
					{key}
				</label>
			);
		}
		return (
			<form className="crea-stanza container-fluid h-100 d-flex flex-column" onSubmit={this.creaStanza}>
				<div className="row centra">
					<img src={Logo} className="w-50 centra" alt="Logo di IQFight"></img>
				</div>
				<div className="row centra">
					<h1 className="titolo"> Crea stanza </h1>
				</div>
				<div className="row centra flex-grow-1" style={{ minHeight: "0px" }}>
					<div className="contenitore-viola h-100 d-flex flex-column">
						<div className="row">
							<div className="col-12 col-sm-6">
								<input type="text" className="form-control-lg shadow" placeholder="Nome stanza" name="nomeStanza" required></input>
							</div>
							<div className="col-12 col-sm-6">
								<div className="centra opzione-toggle form-control-lg shadow">
									<p>Stanza privata</p>
									<Toggle name="privata"></Toggle>
								</div>
							</div>
						</div>
						<div className="row centra">
							<h5> Seleziona una categoria </h5>
						</div>
						<div className="row centra flex-grow-1" style={{ minHeight: "0px" }}>
							<div className="div-categorie w-100 h-100 d-flex flex-wrap overflow-auto centra">{categorie}</div>
						</div>
					</div>
				</div>
				<div className="row centra" style={{ marginTop: "1em" }}>
					<button type="submit" className="bottone">
						Crea
					</button>
				</div>
			</form>
		);
	}
}
