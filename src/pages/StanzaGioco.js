import React from "react";
import "./StanzaGioco.css";
import Card from "../components/Card";
import logo from "../img/iqfight-logo.png";
import userImage from "../img/user.png";
import "./SalaAttesa.css";
import Vincitori from "./Vincitori";
import Scrollbars from "react-custom-scrollbars";

class StanzaGioco extends React.Component {
	constructor() {
		super();
		this.getStato = this.getStato.bind(this);
		this.rispondi = this.rispondi.bind(this);
		this.chiediDomanda = this.chiediDomanda.bind(this);
		this.state = {
			domanda: "",
			risposta1: "",
			risposta2: "",
			risposta3: "",
			risposta4: "",
			giocatori: {},
			finita: false,
			risposto: false,
			miaRisposta: null,
		};

		this.width = window.innerWidth;
		this.stateInterval = null;
		this.domandaInterval = null;
		this.refresh = 1000;
		this.tempoDomanda = "20s";
		this.tempoRisultati = 2000 + Math.floor(Math.random() * 1000);
	}

	risettaStato() {
		const progressBar = document.getElementById("prog");
		progressBar.style.transitionDuration = "0s";
		progressBar.style.width = "100%";
		void progressBar.offsetWidth; // Triggera il reflow
		progressBar.style.transitionDuration = this.tempoDomanda;

		let giocatori = { ...this.state.giocatori };
		for (let giocatore in giocatori) {
			giocatori[giocatore].risposto = false;
			giocatori[giocatore].rispostaCorretta = null;
		}
		let lista = document.getElementsByClassName("risposta");

		for (let risposta of lista) {
			risposta.classList.remove("correggi-risposta");
			risposta.style.opacity = 1;
			risposta.style.backgroundColor = "var(--colore-card)";
			risposta.style.fontWeight = "unset";
		}

		this.setState({
			risposto: false,
			miaRisposta: null,
			giocatori,
		});
	}

	componentDidMount() {
		if (window.innerWidth < 576) window.scrollTo({ top: 0, behavior: "smooth" });
		this.chiediDomanda();
		this.domandaInterval = setInterval(this.chiediDomanda, this.refresh);
	}

	chiediDomanda() {
		let xhr = new XMLHttpRequest();
		xhr.open("GET", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/domanda.php");
		xhr.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				let json = JSON.parse(e.target.responseText);
				if (json["successo"] === true) {
					if (json["azione"] === "finita") {
						this.setState({ finita: true, giocatori: json["giocatori"] });
						clearInterval(this.stateInterval);
						clearInterval(this.domandaInterval);
						this.stateInterval = null;
					} else {
						clearInterval(this.domandaInterval);
						this.risettaStato();
						this.setState({
							domanda: json["domanda"],
							risposta1: json["risposte"][0],
							risposta2: json["risposte"][1],
							risposta3: json["risposte"][2],
							risposta4: json["risposte"][3],
						});
						const progress = document.getElementById("prog");
						progress.style.width = "0%";

						document.getElementById("progress").style.opacity = 1;
						if (!this.stateInterval) this.stateInterval = setInterval(this.getStato, this.refresh);
					}
				}
			}
		};
		xhr.withCredentials = true;
		xhr.send();
	}

	creaGiocatori() {
		let cardGiocatori = [];
		let jGiocatori = this.state.giocatori;
		for (let chiave in jGiocatori) {
			let classi = "";
			if (jGiocatori[chiave].risposto) classi += "giocatore-risposto ";
			if (jGiocatori[chiave].rispostaCorretta) classi += "giocatore-corretta ";
			else if (jGiocatori[chiave].rispostaCorretta != null && !jGiocatori[chiave].rispostaCorretta) {
				classi += "giocatore-sbagliata ";
			}
			cardGiocatori.push(
				<Card
					nome={jGiocatori[chiave].username}
					punteggio={jGiocatori[chiave].punteggio}
					immagine={jGiocatori[chiave].avatar ? process.env.REACT_APP_LOCAL_ENDPOINT + jGiocatori[chiave].avatar : userImage}
					style={{ width: "90%" }}
					className={classi}
					key={chiave}></Card>
			);
		}
		return cardGiocatori;
	}

	rispostaGiusta() {
		const risposta = this.state.miaRisposta;
		risposta.style.backgroundColor = "#2FC017";
	}

	rispostaSbagliata(rispostaGiusta) {
		const risposta = this.state.miaRisposta;
		if (risposta) risposta.style.backgroundColor = "#C54343";
		let listaRisposte = document.getElementsByClassName("risposta");
		for (let risp of listaRisposte) {
			if (risp.textContent === rispostaGiusta) {
				risp.classList.add("correggi-risposta");
				risp.style.opacity = 1;
			}
		}
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
						let newGiocatori = {};
						for (let giocatore in json["giocatori"]) {
							newGiocatori[giocatore] = json["giocatori"][giocatore];
							newGiocatori[giocatore].punteggio = giocatore in this.state.giocatori ? this.state.giocatori[giocatore].punteggio : 0;
						}
						this.setState({
							giocatori: newGiocatori,
						});
					} else if (json["azione"] === "risultati") {
						let newGiocatori = {};
						for (let giocatore in json["giocatori"]) {
							let avatar = this.state.giocatori[giocatore].avatar;
							newGiocatori[giocatore] = json["giocatori"][giocatore];
							newGiocatori[giocatore].punteggio = json["giocatori"][giocatore].punteggio;
							newGiocatori[giocatore].avatar = avatar;
						}
						this.setState({
							giocatori: newGiocatori,
						});
						// Fine del round
						document.getElementById("progress").style.opacity = 0;
						clearInterval(this.stateInterval);
						this.stateInterval = null;
						if (this.state.miaRisposta == null || this.state.miaRisposta.textContent !== json["rispCorretta"])
							this.rispostaSbagliata(json["rispCorretta"]);
						else this.rispostaGiusta();
						setTimeout(() => {
							this.chiediDomanda();
							this.domandaInterval = setInterval(this.chiediDomanda, this.refresh);
						}, this.tempoRisultati);
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
			e.target.style.backgroundColor = "#9e8fc9";
			e.target.style.fontWeight = "bolder";
			let xhr = new XMLHttpRequest();
			xhr.open("POST", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/rispondi.php");
			xhr.withCredentials = true;
			xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			xhr.send(JSON.stringify({ risposta: risposta }));
			this.setState({ risposto: true, miaRisposta: e.target });
			const risposte = document.getElementsByClassName("risposta");
			for (let risposta of risposte) {
				if (risposta !== e.target) risposta.style.opacity = 0.2;
			}
		}
	}

	componentWillUnmount() {
		clearInterval(this.stateInterval);
		clearInterval(this.domandaInterval);
	}

	render() {
		return this.state.finita ? (
			<Vincitori giocatori={this.state.giocatori} cambia={this.props.cambia}></Vincitori>
		) : (
			<div className="pagina-classifica stanza-gioco w-100 h-100 flex-column centra elimina-padding">
				{this.width < 576 ? <img src={logo} alt="Logo" className="mb-1 immagine iqfight-logo"></img> : null}
				<div className="row w-100 div-princ mt-3 elimina-padding">
					<div className="col-12 col-sm-8 mt-4 elimina-padding">
						<div className="progress mb-4" id="progress" style={{ transition: "all .5s" }}>
							<div
								id="prog"
								className="progress-bar progress-bar-striped progress-bar-animated"
								role="progressbar"
								style={{
									width: "100%",
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
							<div className={"risposta mb-4 centra"} onClick={this.rispondi}>
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
						{this.width >= 576 ? <img src={logo} alt="Logo" className="mb-4 iqfight-logo"></img> : null}
						<div className=" giocatori ">
							<div style={{ color: "white", paddingTop: "1em", fontSize: "large" }}>Giocatori</div>
							<Scrollbars
								style={{ flexGrow: 1 }}
								renderView={(props) => (
									<div
										{...props}
										className="d-flex flex-column align-items-center"
										style={{ ...props.style, paddingRight: "8px" }}
									/>
								)}>
								{this.creaGiocatori()}
							</Scrollbars>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default StanzaGioco;
