import React from "react";
import SalaAttesa from "./SalaAttesa";
import StanzaGioco from "./StanzaGioco";

class Gioco extends React.Component {
	constructor(props) {
		super(props);
		this.aggiungiGiocatore = this.aggiungiGiocatore.bind(this);
		this.aggiornaPagina = this.aggiornaPagina.bind(this);
		this.state = {
			id: this.props.match.params.id,
			stringa: "",
			iniziata: 0,
			diz: {},
			giocatori: [],
			creatore: false,
		};

		this.updateInterval = null;
		this.refresh = 1000;
	}

	aggiungiGiocatore(id) {
		let xml = new XMLHttpRequest();
		let json = { azione: "entra", idStanza: id };
		xml.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				let json2 = JSON.parse(e.target.responseText);
				if (json2["successo"] === true) {
					if (json2["iniziata"] === 0) {
						this.setState({
							iniziata: 0,
							diz: json2,
						});
						this.updateInterval = setInterval(this.aggiornaPagina, this.refresh);
					} else {
						this.setState({
							stringa: "La partita è gia iniziata",
						});
					}
				} else
					this.setState({
						stringa: "fallimento nel caricamento...",
					});
			}
		};
		xml.open("PUT", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/stanza.php");
		xml.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xml.withCredentials = true;
		xml.send(JSON.stringify(json));
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
						this.setState({
							iniziata: true,
						});
					}
				}
			}
		};
		xml.open("GET", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/stanza.php");
		xml.withCredentials = true;
		xml.send();
	}

	componentDidMount() {
		let id = this.state.id;
		this.aggiungiGiocatore(id);
		window.addEventListener("unload", this.esciStanza);
	}

	componentWillUnmount() {
		if (this.updateInterval) clearInterval(this.updateInterval);
		window.removeEventListener("unload", this.esciStanza);
		this.esciStanza();
	}

	esciStanza() {
		// Il keepalive permette alla richiesta di proseguire anche dopo la chiusura della finestra corrente
		// L'alternativa con l'XHR è di usare una richiesta sincrona ma non è più supportata da Chrome
		// Il fetch al contrario, non è supportato da IE
		fetch(process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/stanza.php", {
			method: "DELETE",
			credentials: "include",
			keepalive: true,
		});
	}

	render() {
		return this.state.iniziata === 0 ? (
			<SalaAttesa {...this.state.diz} giocatori={this.state.giocatori} idStanza={this.state.id}></SalaAttesa>
		) : (
			<StanzaGioco></StanzaGioco>
		);
	}
}
export default Gioco;
