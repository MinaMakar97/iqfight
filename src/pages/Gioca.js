import React, { Component } from "react";
import Logo from "../img/iqfight-logo.png";
import "./Gioca.css";
import Select from "react-select";
import CardStanza from "../components/CardStanza";
import { Link } from "react-router-dom";

export default class Gioca extends Component {
	constructor(props) {
		super(props);
		this.state = {
			stanze: [],
			categorie: ["Tutte", "Arte", "Geografia", "Giochi", "Informatica", "Lingue", "Scienze", "Spettacolo", "Storia"],
		};
		this.xhr = null;
		this.xhrCat = null;
	}

	componentDidMount() {
		// const categorie = ["Arte", "Geografia", "Giochi", "Informatica", "Lingue", "Scienze", "Spettacolo", "Storia"];
		// let stanze = [];
		// for (let i = 0; i < 25; i++) {
		// 	stanze.push({
		// 		nome: "Stanza" + i,
		// 		categoria: categorie[Math.floor(Math.random() * categorie.length)],
		// 		giocatori: Math.floor(Math.random() * 8),
		// 	});
		// }
		// this.setState({
		// 	stanze: stanze,
		// });

		this.xhr = new XMLHttpRequest();
		this.xhr.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				let json = JSON.parse(e.target.responseText);
				if (json["successo"] === true) {
					this.setState({ stanze: json["stanze"] });
				}
			}
		};
		this.xhr.open("GET", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/browser-stanze.php");
		this.xhr.withCredentials = true;
		this.xhr.send();

		this.xhrCat = new XMLHttpRequest();
		this.xhrCat.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				let json = JSON.parse(e.target.responseText);
				if (json["successo"] === true) {
					this.setState({ categorie: json["categorie"] });
				}
			}
		};
		this.xhrCat.open("GET", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/aggiungi-domanda.php");
		this.xhrCat.withCredentials = true;
		this.xhrCat.send();
	}

	componentWillUnmount() {
		if (this.xhr) this.xhr.onreadystatechange = null;
		if (this.xhrCat) this.xhrCat.onreadystatechange = null;
	}

	render() {
		const options = this.state.categorie.map((el) => {
			return { value: el, label: el };
		});
		const styles = {
			container: (provided) => ({ ...provided, padding: "0 !important", marginBottom: 0 }),
			control: (provided) => ({
				...provided,
				boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.4)",
				borderRadius: "10px",
				height: "calc(1.5em + 1rem + 2px)",
			}),
			placeholder: (provided) => ({ ...provided, color: "#c1b1ec" }),
			singleValue: (provided) => ({ ...provided, color: "#8B6EDD" }),
		};

		return (
			<div className="gioca w-100 h-100 d-flex flex-column">
				<div className="row centra">
					<img src={Logo} className="w-50 centra" alt="Logo di IQFight"></img>
				</div>
				<div className="row centra">
					<h1 className="titolo"> Entra in una stanza </h1>
				</div>
				<div className="row centra flex-grow-1 order-3 order-sm-1" style={{ minHeight: 0 }}>
					<div className="contenitore-viola h-100">
						<div className="row centra">
							<div className="col-12 col-sm-6 d-flex align-items-center">
								<p style={{ marginRight: "1em", color: "#8B6EDD" }}>Categoria</p>
								<Select
									defaultValue={{ label: "Tutte", value: "Tutte" }}
									options={options}
									className="form-control-lg"
									styles={styles}
									theme={(theme) => ({
										...theme,
										colors: { ...theme.colors, primary: "#8B6EDD", primary50: "#c1b1ec", primary25: "#d7ceed" },
									})}
									isSearchable={false}></Select>
							</div>
							<div className="col-12 col-sm-6">
								<input type="text" placeholder="Cerca stanza..." className="form-control-lg shadow"></input>
							</div>
						</div>
						{this.state.stanze.length == 0 ? (
							<div className="centra flex-grow-1 text-center" style={{ color: "rgb(101, 64, 204)" }}>
								<p>
									Non ci sono stanze disponibili,<br></br> perchè non ne crei una?
								</p>
							</div>
						) : (
							<div className="row flex-wrap div-stanze centra">
								{this.state.stanze.map((stanza, index) => (
									<Link to={"/room/" + stanza.id} key={index}>
										<CardStanza
											nomeStanza={stanza.nome}
											categoria={stanza.categoria}
											numGiocatori={stanza.giocatori}
											maxGiocatori={8}></CardStanza>
									</Link>
								))}
							</div>
						)}
					</div>
				</div>
				<div className="row centra order-2">
					<div className="riga-testo-riga">
						<hr className="riga"></hr> <p> OPPURE </p> <hr className="riga"></hr>
					</div>
				</div>
				<div className="row centra order-1 order-sm-3">
					<Link to="/crea-stanza">
						<button className="bottone">Crea stanza</button>
					</Link>
				</div>
			</div>
		);
	}
}
