import React from "react";
import "./CardInfo.css";

class CardInfo extends React.Component {
	componentDidUpdate() {
		if (this.props.id && !this.props.disabled && this.props.modifica) document.getElementById(this.props.id).select();
	}

	render() {
		return (
			<div className={"div-card shadow " + this.props.className + " row mb-0"} style={this.props.style} onClick={this.props.onClick}>
				<div className={this.props.html !== undefined ? "col-7 col-sm-9 p-0 h-100 scritte" : null}>
					<div className="row nome-sezione"> {this.props.nomeSezione}</div>
					<div className="row sezione">
						{this.props.modifica ? (
							<input
								className="w-100 h-100"
								id={this.props.id}
								type={this.props.tipo}
								defaultValue={this.props.sezione}
								name={this.props.id}
								onKeyUp={this.props.invia}
								autoFocus={this.props.disabled}
								onBlur={this.props.onBlur}
								style={
									!this.props.disabled
										? { boxShadow: "1px 1px 8px var(--colore-border)", border: "none", outline: "none" }
										: { border: "unset" }
								}
								disabled={this.props.disabled}></input>
						) : (
							<div id={this.props.id}> {this.props.sezione} </div>
						)}
					</div>
				</div>
				{this.props.html}
			</div>
		);
	}
}

export default CardInfo;
