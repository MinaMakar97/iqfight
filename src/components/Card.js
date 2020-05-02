import React from "react";
import "./Card.css";

class Card extends React.Component {
	render() {
		return (
			<div className={"card shadow mt-3 mt-lg-4 " + this.props.className} style={this.props.style}>
				{/* la prima colonna */}
				<div className="dis-img">
					<img src={this.props.immagine} className="img-card" alt="" />
				</div>

				{/* la seconda colonna */}
				<div className="dis-text">
					<div className="font-weight-bold a">{this.props.nome}</div>
					<div className="text-muted a">{this.props.punteggio}</div>
				</div>
			</div>
		);
	}
}
export default Card;
