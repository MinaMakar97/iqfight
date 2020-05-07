import React from "react";
import logo from "../img/iqfight-logo.png";
import CardInfo from "../components/CardInfo";
import "./SalaAttesa.css";
import Card from "../components/Card";
import userImage from "../img/user.png";

class StanzaAttesa extends React.Component {
	constructor(props) {
		super(props);
		this.creaGiocatori = this.creaGiocatori.bind(this);
		this.avvia = this.avvia.bind(this);
	}

	creaGiocatori() {
		let cardGiocatori = [];
		let jGiocatori = this.props.giocatori;
		for (let i = 0; i < jGiocatori.length; i++) {
			cardGiocatori.push(
				<Card
					nome={jGiocatori[i].username}
					punteggio={jGiocatori[i].punteggio}
					immagine={jGiocatori[i].avatar || userImage}
					style={{ width: "90%" }}
					key={i}></Card>
			);
		}
		return cardGiocatori;
	}

	avvia() {
		let xml = new XMLHttpRequest();
		let json = { azione: "inizio", idStanza: this.props.id };
		xml.open("PUT", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/stanza.php");
		xml.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xml.withCredentials = true;
		xml.send(JSON.stringify(json));
	}

	render() {
		return (
			<div className="pagina-classifica w-100 h-100 flex-column centra">
				<img src={logo} alt="Logo"></img>
				<p className="centra" style={{ color: "white", fontSize: "2em", marginTop: ".5em" }}>
					Sala d'attesa
				</p>
				<div className="row w-100 div-princ mt-3">
					<div className="col-12 col-sm-8">
						<CardInfo nomeSezione={"Nome stanza"} sezione={this.props.nome} style={{ width: "100%" }}></CardInfo>
						<div className="row">
							<div className={"col-12 col-sm-6"} style={{ paddingLeft: 0 }}>
								<CardInfo nomeSezione={"Categoria"} sezione={this.props.categoria} style={{ width: "100%" }}></CardInfo>
							</div>
							<div className={"col-12 col-sm-6"} style={{ paddingRight: 0 }}>
								<CardInfo
									nomeSezione={"Visbilità stanza"}
									sezione={this.props.privata === 0 ? "Pubblica" : "Privata"}
									style={{ width: "100%" }}></CardInfo>
							</div>
						</div>
						<CardInfo
							nomeSezione={"Link stanza"}
							sezione={"https://iqfight.altervista.org/room/" + this.props.id}
							style={{ width: "100%" }}></CardInfo>
					</div>
					<div className="col-12 col-sm-1">
						<hr className="riga"></hr>
					</div>

					<div className="col-12 col-sm-3 giocatori">
						<div style={{ color: "#8B6EDD", paddingTop: "1em", fontSize: "large" }}>Giocatori</div>
						{this.creaGiocatori()}
					</div>
				</div>
				<div className="centra mt-4">
					{this.props.creatore ? (
						<button className="bottone" onClick={this.avvia}>
							Avvia
						</button>
					) : (
						<p className="titolo">In attesa dell'inizio della partita</p>
					)}
				</div>
			</div>
		);
	}
}

export default StanzaAttesa;
