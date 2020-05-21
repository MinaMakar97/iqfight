import React from "react";
import "./CardInfo.css";

class CardInfo extends React.Component {
	render() {
		return (
			<div className={"div-card " + this.props.className + " row mb-4"} style={this.props.style}>
				<div className={this.props.html !== undefined ? "col-7 col-sm-9 p-0 h-100" : null}>
					<div className="row nome-sezione"> {this.props.nomeSezione}</div>
					<div className="row sezione" style={this.props.tronca !== undefined ? { textOverflow: "ellipsis !important" } : null}>
						<input
							className="w-100"
							style={{ border: "unset" }}
							id={this.props.id}
							type={this.props.tipo}
							defaultValue={this.props.sezione}
							name={this.props.id}
							onKeyPress={this.props.invia}
							disabled={this.props.disabled}></input>
					</div>
				</div>
				{this.props.html}
			</div>
		);
	}
}

export default CardInfo;
