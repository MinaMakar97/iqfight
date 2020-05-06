import React from "react";

class Gioco extends React.Component {
	constructor(props) {
		super(props);
		this.aggiungiGiocatore = this.aggiungiGiocatore.bind(this);
		//this.aggiornaPagina = this.aggiornaPagina.bind();
		this.state = {
			id: this.props.match.params.id,
			stringa: "",
		};
	}

	aggiungiGiocatore(id) {
		let xml = new XMLHttpRequest();
		let json = { azione: "entra", idStanza: id };
		xml.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				let json2 = JSON.parse(e.target.responseText);
				if (json2["successo"] === true) {
					if (json2["iniziata"] === 0)
						this.setState({
							stringa: "sei stato aggiunto con successo a " + id,
						});
					else {
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

	//aggiornaPagina(id) {}

	componentDidMount() {
		let id = this.state.id;
		this.aggiungiGiocatore(id);
	}
	render() {
		return (
			<div>
				<p>{this.state.stringa}</p>
			</div>
		);
	}
}
export default Gioco;
