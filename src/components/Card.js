import React from "react";
import "./Card.css";

class Card extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			punteggio: this.props.punteggio,
			incremento: 0,
		};
	}

	componentWillUpdate(nextProps) {
		if (this.props.punteggio !== nextProps.punteggio) {
			let oldPunti = this.props.punteggio || 0;
			let newPunti = nextProps.punteggio;
			this.setState({ incremento: newPunti - oldPunti });
			setTimeout(() => {
				this.setState({ incremento: 0, punteggio: newPunti });
			}, 1700);
		}
	}

	render() {
		return (
			<div className={"card shadow mt-2 mt-lg-2 " + this.props.className} style={this.props.style}>
				{/* la prima colonna */}
				<div className="dis-img">
					<img src={this.props.immagine} className="img-card" alt="" />
				</div>

				{/* la seconda colonna */}
				<div className="dis-text">
					<div className="font-weight-bold a">{this.props.nome}</div>
					<div className="text-muted a">
						{this.state.punteggio}
						{this.state.incremento > 0 ? <span style={{ color: "var(--colore-scritte)" }}> + {this.state.incremento}</span> : null}
					</div>
				</div>
				<div className="posizione">{this.props.posizione}</div>
			</div>
		);
	}
}
export default Card;
