import React, { Component } from "react";
import logo from "../img/iqfight-logo.png";
import "./Classifica.css";
import Card from "../components/Card";
import userImage from "../img/user.png";

export default class Classifica extends Component {
	constructor(props) {
		super(props);

		this.state = {
			giocatori: [],
		};

		this.xhr = null;
	}

	componentDidMount() {
		this.xhr = new XMLHttpRequest();
		this.xhr.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				const json = JSON.parse(e.target.responseText);
				if (json["successo"]) this.setState({ giocatori: json["giocatori"] });
				else document.getElementById("status").textContent = "Si è verificato un errore con la connessione al database";
			}
		};
		this.xhr.onerror = (e) => {
			document.getElementById("status").textContent = "Si è verificato un errore con la connessione al server";
		};
		this.xhr.open("GET", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/classifica.php");
		this.xhr.send();
	}

	componentWillUnmount() {
		this.xhr.onerror = null;
	}

	creaGiocatori() {
		const classiPodio = ["primo-classifica", "secondo-classifica", "terzo-classifica"];
		let cardColonna = [];
		const giocatori = this.state.giocatori;
		for (let i = 0; i < giocatori.length; i++) {
			cardColonna.push(
				<Card
					className={i < 3 ? classiPodio[i] : ""}
					nome={giocatori[i].username}
					punteggio={giocatori[i].punteggio.toLocaleString() + " punti"}
					immagine={giocatori[i].avatar ? process.env.REACT_APP_LOCAL_ENDPOINT + giocatori[i].avatar : userImage}
					style={{ animationDelay: i * 0.25 + "s" }}
					key={i}></Card>
			);
		}
		return cardColonna;
	}

	render() {
		return (
			<div className="pagina-classifica w-100 h-100 d-flex flex-column">
				<div className="row">
					<div className="col-12 text-center mb-4">
						<img src={logo} alt="Logo di IQFight" className="w-50 iqfight-logo"></img>
					</div>
				</div>
				<div className="row">
					<div className="col-12 text-center">
						<p className="titolo"> Classifica </p>
					</div>
				</div>
				{this.state.giocatori.length === 0 ? (
					<div className="centra">
						<p id="status" className="text-center"></p>
					</div>
				) : (
					<div className="row contenuto-classifica flex-wrap centra">{this.creaGiocatori()}</div>
				)}
			</div>
		);
	}
}
