import React, { Component } from "react";
import "./CardStanza.css";

export default class CardStanza extends Component {
	constructor(props) {
		super(props);
		this.mappaColori = {
			Arte: "maroon",
			Geografia: "#56BADA",
			Giochi: "gold",
			Informatica: "#6254FF",
			Lingue: "#E62B2B",
			Scienze: "#3BB347",
			Spettacolo: "#DF27E2",
			Storia: "#F89C12",
		};
	}

	render() {
		return (
			<div className="card-stanza" style={{ backgroundColor: this.mappaColori[this.props.categoria] }}>
				<div className="div-info">
					<p className="nome-stanza">{this.props.nomeStanza}</p>
					<p className="categoria-stanza">{this.props.categoria}</p>
				</div>
				<div className="div-giocatori">
					<span className="num-giocatori">{this.props.numGiocatori}</span>
					<span className="max-giocatori"> / {this.props.maxGiocatori}</span>
				</div>
				<i className="fas fa-caret-right freccia"></i>
			</div>
		);
	}
}
