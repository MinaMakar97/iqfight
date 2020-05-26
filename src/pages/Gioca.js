import React, { Component } from "react";
import Logo from "../img/iqfight-logo.png";
import "./Gioca.css";
import Select from "react-select";
import CardStanza from "../components/CardStanza";
import { Link } from "react-router-dom";
import Scrollbars from "react-custom-scrollbars";

export default class Gioca extends Component {
	constructor(props) {
		super(props);
		this.state = {
			stanze: null,
			cerca: "",
			categoria: "Tutte",
			categorie: ["Tutte", "Arte", "Geografia", "Giochi", "Informatica", "Lingue", "Scienze", "Spettacolo", "Storia"],
		};
		this.xhr = null;
		this.xhrCat = null;
		this.cerca = this.cerca.bind(this);
		this.filtra = this.filtra.bind(this);
		this.chiediStanza = this.chiediStanza.bind(this);
	}

	chiediStanza() {
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
	}

	componentDidMount() {
		this.chiediStanza();
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

	cerca(e) {
		let elementoCercato = e.target.value;
		this.setState({
			cerca: elementoCercato,
		});
	}

	filtra(e) {
		this.setState({
			categoria: e.value,
		});
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
				border: "none",
			}),
			placeholder: (provided) => ({ ...provided, color: "var(--colore-placeholder)" }),
			singleValue: (provided) => ({ ...provided, color: "var(--colore-quart)" }),
		};

		let contenutoStanze = null;
		if (this.state.stanze !== null)
			contenutoStanze =
				this.state.stanze.length === 0 ? (
					<div className="centra flex-grow-1 text-center w-100 h-100" style={{ color: "var(--colore-border)" }}>
						<p>
							Non ci sono stanze disponibili,<br></br> perchè non ne crei una?
						</p>
					</div>
				) : (
					this.state.stanze
						.filter((e) => e.nome.toLowerCase().includes(this.state.cerca.toLowerCase()))
						.filter((e) => this.state.categoria === "Tutte" || (this.state.categoria !== "Tutte" && this.state.categoria === e.categoria))
						.map((stanza, index) => (
							<Link to={"/room/" + stanza.id} key={index}>
								<CardStanza
									nomeStanza={stanza.nome}
									categoria={stanza.categoria}
									numGiocatori={stanza.giocatori}
									maxGiocatori={8}></CardStanza>
							</Link>
						))
				);

		return (
			<div className="gioca w-100 h-100 d-flex flex-column">
				<div className="row centra">
					<img src={Logo} className="w-50 centra iqfight-logo" alt="Logo di IQFight"></img>
				</div>
				<div className="row centra">
					<h1 className="titolo"> Entra in una stanza </h1>
				</div>
				<div className="row centra flex-grow-1 order-3 order-sm-1" style={{ minHeight: 0 }}>
					<div className="contenitore-viola h-100 centra">
						<div className="row" style={{ width: "90%" }}>
							<div className="col-12 col-sm-6 d-flex align-items-center">
								<Select
									onChange={this.filtra}
									placeholder="Categoria"
									options={options}
									className="form-control-lg"
									styles={styles}
									theme={(theme) => ({
										...theme,
										colors: {
											...theme.colors,
											primary: "var(--colore-secondario)",
											primary50: "var(--colore-secondario)",
											primary25: "var(--colore-secondario)",
											neutral0: "var(--colore-card)",
										},
									})}
									isSearchable={false}></Select>
							</div>

							<div className="col-12 col-sm-6">
								<div className="d-flex">
									<input
										type="text"
										placeholder="Cerca stanza..."
										className="form-control-lg shadow flex-grow-1"
										onChange={this.cerca}></input>

									<button className="ricarica shadow form-control-lg" onClick={this.chiediStanza}>
										<i className="fa fa-refresh icona" aria-hidden="true"></i>
									</button>
								</div>
							</div>
						</div>
						<Scrollbars
							className="row div-stanze centra d-flex flex-grow-1"
							renderView={(props) => (
								<div
									{...props}
									className="d-flex flex-wrap scroll-bar-content"
									style={{ ...props.style, alignContent: "flex-start" }}
								/>
							)}>
							{contenutoStanze}
						</Scrollbars>
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
