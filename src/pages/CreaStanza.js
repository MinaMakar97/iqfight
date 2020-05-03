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
	}
	render() {
		const categorie = [];
		categorie.push(<input type="radio" name="categoria" className="d-none" id="casuale" key="casuale"></input>);
		categorie.push(
			<label className="categoria centra domande-casuali" htmlFor="casuale" key="lab-casuale">
				Domande Casuali
				<br />
				Classificata
			</label>
		);
		for (let key in this.mappaColori) {
			categorie.push(<input type="radio" name="categoria" className="d-none" id={key} key={"lab-" + key}></input>);
			categorie.push(
				<label className="categoria centra" style={{ backgroundColor: this.mappaColori[key] }} htmlFor={key} key={key}>
					{key}
				</label>
			);
		}
		return (
			<div className="crea-stanza container-fluid h-100 d-flex flex-column">
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
								<input type="text" className="form-control-lg shadow" placeholder="Nome stanza" required></input>
							</div>
							<div className="col-12 col-sm-6">
								<div className="centra opzione-toggle form-control-lg shadow">
									<p>Stanza privata</p>
									<Toggle></Toggle>
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
					<button className="bottone">Crea</button>
				</div>
			</div>
		);
	}
}
