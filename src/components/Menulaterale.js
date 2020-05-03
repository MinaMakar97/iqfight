import React, { Component } from "react";
import "./MenuLaterale.css";
import { withRouter } from "react-router-dom";

class MenuLaterale extends Component {
	constructor(props) {
		super(props);
		this.state = { aperto: !(window.innerWidth <= 576) };
		this.setta = this.setta.bind(this);
		this.cambiaPagina = this.cambiaPagina.bind(this);
        this.sezioni = ["Guida", "Classifica", "Gioca", "Aggiungi domanda", "Esci"];
        this.lista = [];
	}

	setta() {
		this.setState((prevState) => ({
			aperto: !prevState.aperto,
		}));
	}

	cambiaPagina(e) {
		this.props.history.push("/" + e.target.getAttribute("id"));
		if (this.sezione) this.sezione.style.backgroundColor = "unset";
		e.target.style.backgroundColor = "#0996BB";
		this.sezione = e.target;
		if (window.innerWidth <= 576) this.setta();
	}
	componentWillMount(){
		for (let sez of this.sezioni){
			this.lista.push(<div className="div-content" id={sez.replace(" ","-")} onClick={this.cambiaPagina} >{sez}</div>);
			this.lista.push(<hr className="riga-menu"></hr>);
		}
	}

	componentDidMount() {
		const path = this.props.location.pathname.slice(1);
		const elementoSezione = document.getElementById(path);
		if (elementoSezione) {
			elementoSezione.style.backgroundColor = "#0996BB";
			this.sezione = elementoSezione;
        }
        
	}

	render() {
		return (
			<div id="div-menu-laterale" style={{ transform: "translateX(" + (this.state.aperto ? "0px" : "-100%") + ")" }}>
				<div id="menu-laterale">
					<hr className="riga-menu"></hr>
                    {this.lista}
				</div>
				<div className="menu-button" onClick={this.setta}>
					<p id="freccia" className={this.state.aperto ? "arrow-right" : "arrow-left"}></p>
				</div>
			</div>
		);
	}
}

export default withRouter(MenuLaterale);
