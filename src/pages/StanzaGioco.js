import React from "react";
import "./StanzaGioco.css";
import Card from "../components/Card";
import logo from "../img/iqfight-logo.png";
import userImage from "../img/user.png";
import "./SalaAttesa.css";
import Vincitori from "./Vincitori";

class StanzaGioco extends React.Component {
	constructor() {
		super();
		this.getStato = this.getStato.bind(this);
		this.rispondi = this.rispondi.bind(this);
		this.state = {
			domanda: "",
			risposta1: "",
			risposta2: "",
			risposta3: "",
			risposta4: "",
			giocatori: [],
			finita: false,
			risposto: false, // Riattivarlo quando cambia domanda
			avviaTempo: false,
			miaRisposta: "",
		};

		this.width = window.innerWidth;
		this.stateInterval = null;
		this.refresh = 1000;
		this.tempoDomanda = "20s";
	}

	componentDidMount() {
		this.chiediDomanda();
	}

	chiediDomanda() {
		let xhr = new XMLHttpRequest();
		xhr.open("GET", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/domanda.php");
		xhr.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				let json = JSON.parse(e.target.responseText);
				if (json["successo"] === true) {
					this.setState({
						domanda: json["domanda"],
						risposta1: json["risposte"][0],
						risposta2: json["risposte"][1],
						risposta3: json["risposte"][2],
						risposta4: json["risposte"][3],
						avviaTempo: true,
					});

					if (!this.stateInterval) this.stateInterval = setInterval(this.getStato, this.refresh);
				}
			}
		};
		xhr.withCredentials = true;
		xhr.send();
	}

	creaGiocatori() {
		let cardGiocatori = [];
		let jGiocatori = this.state.giocatori;
		for (let i = 0; i < jGiocatori.length; i++) {
			cardGiocatori.push(
				<Card
					nome={jGiocatori[i].username}
					punteggio={jGiocatori[i].punteggio}
					immagine={jGiocatori[i].avatar || userImage}
					style={{ width: "90%" }}
					className={jGiocatori[i].risposto ? "giocatore-risposto" : ""}
					key={i}></Card>
			);
		}
		return cardGiocatori;
	}

	getStato() {
		let xhr = new XMLHttpRequest();
		xhr.open("GET", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/stato.php");
		xhr.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				let json = JSON.parse(e.target.responseText);
				if (json["successo"] === true) {
					if (json["azione"] === "aggiorna") {
						// Qualcuno ha risposto, è entrato o è uscito
						this.setState({
							giocatori: json["giocatori"],
						});
					} else if (json["azione"] === "risultati") {
						// Fine del round
						//console.log("Risultati", json);
					} else if (json["azione"] === "finita") {
						// Fine della partita
						this.setState({ finita: true, giocatori: json["giocatori"] });
					}
				}
			}
		};
		xhr.withCredentials = true;
		xhr.send();
	}

	rispondi(e) {
		if (!this.state.risposto) {
			const risposta = e.target.textContent;
			e.target.style.backgroundColor = "#E0D5FF";
			e.target.style.fontWeight = "bolder";
			let xhr = new XMLHttpRequest();
			xhr.open("POST", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/rispondi.php");
			xhr.withCredentials = true;
			xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			xhr.send(JSON.stringify({ risposta: risposta }));
			this.setState({ risposto: true, miaRisposta: risposta });
			const risposte = document.getElementsByClassName("risposta");
			for (let risposta of risposte) {
				if (risposta !== e.target) risposta.style.opacity = 0.2;
			}
		}
	}

	componentWillUnmount() {
		clearInterval(this.stateInterval);
	}

	render() {
		return this.state.finita ? (
			<Vincitori giocatori={this.state.giocatori}></Vincitori>
		) : (
			<div className="pagina-classifica stanza-gioco w-100 h-100 flex-column centra">
				{this.width < 576 ? <img src={logo} alt="Logo" className="mb-4"></img> : null}
				<div className="row w-100 div-princ mt-3">
					<div className="col-12 col-sm-8 mt-4">
						<div className="progress mb-4">
							<div
								className="progress-bar progress-bar-striped progress-bar-animated"
								role="progressbar"
								style={{
									width: this.state.avviaTempo ? "0%" : "100%",
									height: "100%",
									transitionDuration: this.tempoDomanda,
									transitionTimingFunction: "linear",
								}}
								aria-valuenow="10"
								aria-valuemin="0"
								aria-valuemax="100"></div>
						</div>
						<div className="domanda mb-4 centra">{this.state.domanda}</div>
						<div className="div-domanda row">
							<div className="risposta mb-4 centra" onClick={this.rispondi}>
								{this.state.risposta1}
							</div>
							<div className="risposta mb-4 centra" onClick={this.rispondi}>
								{this.state.risposta2}
							</div>
						</div>
						<div className="div-domanda row">
							<div className="risposta mb-4 centra" onClick={this.rispondi}>
								{this.state.risposta3}
							</div>
							<div className="risposta mb-4 centra" onClick={this.rispondi}>
								{this.state.risposta4}
							</div>
						</div>
					</div>
					<div className="col-12 col-sm-1 centra">
						<hr className="riga"></hr>
					</div>
					<div className="col-12 col-sm-3 centra flex-column">
						{this.width >= 576 ? <img src={logo} alt="Logo" className="mb-4"></img> : null}
						<div className=" giocatori ">
							<div style={{ color: "#8B6EDD", paddingTop: "1em", fontSize: "large" }}>Giocatori</div>
							{this.creaGiocatori()}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default StanzaGioco;
