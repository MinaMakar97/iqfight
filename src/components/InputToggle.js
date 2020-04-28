import React, { Component } from "react";
import Toggle from "./Toggle";
import "./InputToggle.css";

export default class InputToggle extends Component {
	render() {
		return (
			<div className={"input-toggle " + this.props.className}>
				<input
					type="text"
					className="input-toggle-text"
					placeholder={this.props.placeholder}
					required={this.props.required}
					name={this.props.name}
					maxLength={this.props.maxLength}></input>
				<Toggle radio={this.props.radio} value={this.props.value} checked={this.props.checked} name={this.props.radioName}></Toggle>
			</div>
		);
	}
}
