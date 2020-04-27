import React from "react";

class Gioco extends React.Component {
	render() {
		return (
			<div>
				<p>Questa è la stanza {this.props.match.params.id}</p>
			</div>
		);
	}
}
export default Gioco;
