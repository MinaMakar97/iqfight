import React, { Component } from "react";
import "./Toggle.css";

export default class Toggle extends Component {
	render() {
		return (
			<label className="toggle">
				<input
					type={this.props.radio ? "radio" : "checkbox"}
					name={this.props.name}
					value={this.props.value}
					defaultChecked={this.props.checked}
					tabIndex={-1}
				/>
				<span className="toggle-slider"></span>
			</label>
		);
	}
}
