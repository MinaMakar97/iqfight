import React from "react";
import SalaAttesa from "./SalaAttesa";
import StanzaGioco from "./StanzaGioco";
import { Link } from "react-router-dom";

class Gioco extends React.Component {
	constructor(props) {
		super(props);
		this.aggiungiGiocatore = this.aggiungiGiocatore.bind(this);
		this.cambiaIniziata = this.cambiaIniziata.bind(this);
		this.iniziaPartita = this.iniziaPartita.bind(this);
		this.state = {
			id: this.props.match.params.id,
			stringa: "",
			iniziata: 0,
			diz: {},
			giocatori: [],
			creatore: false,
			stanzaCorretta: null,
		};
	}

	iniziaPartita() {
		this.setState({ iniziata: 1 });
	}

	aggiungiGiocatore(id) {
		let xml = new XMLHttpRequest();
		let json = { azione: "entra", idStanza: id };
		xml.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				let json2 = JSON.parse(e.target.responseText);
				if (json2["successo"] === true) {
					this.setState({ stanzaCorretta: true });
					if (json2["iniziata"] === 0) {
						this.setState({
							iniziata: 0,
							diz: json2,
						});
					} else {
						this.setState({
							stringa: "La partita è gia iniziata",
						});
					}
				} else
					this.setState({
						stringa: "fallimento nel caricamento...",
						stanzaCorretta: false,
					});
			}
		};
		xml.open("PUT", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/stanza.php");
		xml.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xml.withCredentials = true;
		xml.send(JSON.stringify(json));
	}

	componentDidMount() {
		let id = this.state.id;
		this.aggiungiGiocatore(id);
		window.addEventListener("unload", this.esciStanza);
	}

	componentWillUnmount() {
		window.removeEventListener("unload", this.esciStanza);
		this.esciStanza();
	}

	esciStanza() {
		// Il keepalive permette alla richiesta di proseguire anche dopo la chiusura della finestra corrente
		// L'alternativa con l'XHR è di usare una richiesta sincrona ma non è più supportata da Chrome
		// Il fetch al contrario, non è supportato da IE
		fetch(process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/esci-stanza.php", {
			method: "POST",
			credentials: "include",
			keepalive: true,
		});
	}
	cambiaIniziata() {
		this.setState({
			iniziata: 0,
		});
	}

	render() {
		let component = (
			<div className="centra flex-column">
				<p> Stanza non esistente</p>
				<Link to="/gioca">
					<button className="bottone">Torna indietro</button>
				</Link>
			</div>
		);
		if (this.state.stanzaCorretta)
			component =
				this.state.iniziata === 0 ? (
					<SalaAttesa
						{...this.state.diz}
						giocatori={this.state.giocatori}
						idStanza={this.state.id}
						inizia={this.iniziaPartita}></SalaAttesa>
				) : (
					<StanzaGioco cambia={this.cambiaIniziata}></StanzaGioco>
				);
		return this.state.stanzaCorretta != null ? component : null;
	}
}
export default Gioco;
