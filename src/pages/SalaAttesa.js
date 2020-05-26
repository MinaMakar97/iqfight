import React from "react";
import logo from "../img/iqfight-logo.png";
import CardInfo from "../components/CardInfo";
import "./SalaAttesa.css";
import Card from "../components/Card";
import userImage from "../img/user.png";
import Scrollbars from "react-custom-scrollbars";

class StanzaAttesa extends React.Component {
	constructor(props) {
		super(props);
		this.creaGiocatori = this.creaGiocatori.bind(this);
		this.avvia = this.avvia.bind(this);
		this.aggiornaPagina = this.aggiornaPagina.bind(this);
		this.state = {
			giocatori: [],
			creatore: "",
			risposto: 0,
			copiato: false,
		};

		this.updateInterval = null;
		this.refresh = 1000;
		this.copiaTimeout = null;
	}

	creaGiocatori() {
		let cardGiocatori = [];
		let jGiocatori = this.state.giocatori;
		for (let i = 0; i < jGiocatori.length; i++) {
			cardGiocatori.push(
				<Card
					nome={jGiocatori[i].username}
					punteggio={jGiocatori[i].punteggio}
					immagine={jGiocatori[i].avatar ? process.env.REACT_APP_LOCAL_ENDPOINT + jGiocatori[i].avatar : userImage}
					style={{ width: "90%" }}
					key={i}></Card>
			);
		}
		return cardGiocatori;
	}

	avvia() {
		let xml = new XMLHttpRequest();
		xml.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				let json = JSON.parse(e.target.responseText);
				if (json["successo"] === true) this.props.inizia();
			}
		};
		xml.open("POST", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/avvia-stanza.php");
		xml.withCredentials = true;
		xml.send();
	}

	aggiornaPagina() {
		let xml = new XMLHttpRequest();
		xml.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				let json = JSON.parse(e.target.responseText);
				if (json["successo"] === true) {
					if (json["azione"] === "aggiorna") {
						this.setState({
							giocatori: json["giocatori"],
							creatore: json["creatore"],
							risposto: 1,
						});
					} else if (json["azione"] === "inizio") {
						clearInterval(this.updateInterval);
						this.props.inizia();
					}
				}
			}
		};
		xml.open("GET", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/stanza.php");
		xml.withCredentials = true;
		xml.send();
	}

	componentDidMount() {
		this.aggiornaPagina();
		this.updateInterval = setInterval(this.aggiornaPagina, this.refresh);
	}

	componentWillUnmount() {
		if (this.updateInterval) clearInterval(this.updateInterval);
	}

	selezionaTesto(element) {
		if (document.body.createTextRange) {
			const range = document.body.createTextRange();
			range.moveToElementText(element);
			range.select();
		} else if (window.getSelection) {
			const selection = window.getSelection();
			const range = document.createRange();
			range.selectNodeContents(element);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	}

	render() {
		return (
			<div className="w-100 h-100 flex-column centra sala-attesa">
				<img src={logo} alt="Logo" className="iqfight-logo"></img>
				<p className="centra" style={{ color: "white", fontSize: "2em", marginTop: ".5em" }}>
					Sala d'attesa
				</p>
				<div className="row w-100 div-princ mt-3">
					<div className="col-12 col-sm-8">
						<CardInfo
							modifica={false}
							nomeSezione={"Nome stanza"}
							sezione={this.props.nome}
							style={{ width: "100%", alignItems: "center" }}></CardInfo>
						<div className="row">
							<div className={"col-12 col-sm-6 p-0 pr-sm-2"}>
								<CardInfo
									modifica={false}
									nomeSezione={"Categoria"}
									sezione={this.props.categoria}
									style={{ width: "100%", alignItems: "center" }}></CardInfo>
							</div>
							<div className={"col-12 col-sm-6 p-0 pl-sm-2"} style={{ paddingRight: 0 }}>
								<CardInfo
									modifica={false}
									nomeSezione={"Visibilità stanza"}
									sezione={this.props.privata === 0 ? "Pubblica" : "Privata"}
									style={{ width: "100%", alignItems: "center" }}></CardInfo>
							</div>
						</div>
						<CardInfo
							html={<i className={this.state.copiato ? "fas fa-check" : "far fa-copy"} style={{ fontSize: "2em" }}></i>}
							id="room-link"
							onClick={() => {
								this.setState({ copiato: true });
								if (this.copiaTimeout) clearTimeout(this.copiaTimeout);
								this.copiaTimeout = setTimeout(() => this.setState({ copiato: false }), 1000);
								const link = document.getElementById("room-link");
								this.selezionaTesto(link);
								document.execCommand("copy");
							}}
							modifica={false}
							nomeSezione={"Link stanza"}
							sezione={"https://iqfight.altervista.org/room/" + this.props.id}
							style={{ width: "100%", alignItems: "center" }}></CardInfo>
					</div>
					<div className="col-12 col-sm-1">
						<hr className="riga"></hr>
					</div>
					<div className="col-12 col-sm-3 giocatori">
						<div style={{ color: "white", paddingTop: "1em", fontSize: "x-large" }}>Giocatori</div>
						<Scrollbars
							style={{ flexGrow: 1 }}
							renderView={(props) => <div {...props} className="scroll-view d-flex flex-column align-items-center" />}>
							{this.creaGiocatori()}
						</Scrollbars>
					</div>
				</div>

				<div className="centra mt-4">
					{this.state.creatore ? (
						<button className="bottone" onClick={this.avvia} style={{ opacity: this.state.risposto }}>
							Avvia
						</button>
					) : (
						<p className="titolo" style={{ textAlign: "center", opacity: this.state.risposto }}>
							In attesa dell'inizio della partita
						</p>
					)}
				</div>
			</div>
		);
	}
}

export default StanzaAttesa;
