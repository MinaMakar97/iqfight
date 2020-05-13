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
		};

		this.updateInterval = null;
		this.refresh = 1000;
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
		this.updateInterval = setInterval(this.aggiornaPagina, this.refresh);
	}

	componentWillUnmount() {
		if (this.updateInterval) clearInterval(this.updateInterval);
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
							<div className={"col-12 col-sm-6 p-0 pr-sm-2"}>
								<CardInfo nomeSezione={"Categoria"} sezione={this.props.categoria} style={{ width: "100%" }}></CardInfo>
							</div>
							<div className={"col-12 col-sm-6 p-0 pl-sm-2"} style={{ paddingRight: 0 }}>
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
						<div style={{ color: "white", paddingTop: "1em", fontSize: "x-large" }}>Giocatori</div>
						<Scrollbars
							style={{ flexGrow: 1 }}
							renderView={(props) => <div {...props} className="scroll-view d-flex flex-column align-items-center" />}>
							{this.creaGiocatori()}
						</Scrollbars>
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
