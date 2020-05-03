import React, { Component } from "react";
import Logo from "../img/iqfight-logo.png";
import "./Gioca.css";
import Select from "react-select";
import CardStanza from "../components/CardStanza";

export default class Gioca extends Component {
	constructor(props) {
		super(props);
		this.state = {
			stanze: [],
			categorie: ["Tutte", "Arte", "Geografia", "Giochi", "Informatica", "Lingue", "Scienze", "Spettacolo", "Storia"],
		};
	}

	componentDidMount() {
		const categorie = ["Arte", "Geografia", "Giochi", "Informatica", "Lingue", "Scienze", "Spettacolo", "Storia"];
		let stanze = [];
		for (let i = 0; i < 25; i++) {
			stanze.push({
				nome: "Stanza" + i,
				categoria: categorie[Math.floor(Math.random() * categorie.length)],
				giocatori: Math.floor(Math.random() * 8),
			});
		}
		this.setState({
			stanze: stanze,
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
						<div className="row flex-wrap div-stanze centra">
							{this.state.stanze.map((stanza, index) => (
								<CardStanza
									nomeStanza={stanza.nome}
									categoria={stanza.categoria}
									numGiocatori={stanza.giocatori}
									maxGiocatori={8}
									key={index}></CardStanza>
							))}
						</div>
					</div>
				</div>
				<div className="row centra order-2">
					<div className="riga-testo-riga">
						<hr className="riga"></hr> <p> OPPURE </p> <hr className="riga"></hr>
					</div>
				</div>
				<div className="row centra order-1 order-sm-3">
					<button className="bottone">Crea stanza</button>
				</div>
			</div>
		);
	}
}