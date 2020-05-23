import React, { Component } from "react";
import Logo from "../img/iqfight-logo.png";
import InputToggle from "../components/InputToggle";
import "./AggiungiDomanda.css";
import Select from "react-select";

export default class AggiungiDomanda extends Component {
	constructor(props) {
		super(props);
		this.state = {
			categorie: ["Scienze", "Tecnologia", "Storia", "Geografia", "Spettacolo"],
		};
		this.inviaDomanda = this.inviaDomanda.bind(this);
	}

	componentDidMount() {
		const req = new XMLHttpRequest();
		req.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				this.setState({ categorie: JSON.parse(e.target.responseText)["categorie"] });
			}
		};
		req.open("GET", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/aggiungi-domanda.php");
		req.send();
	}

	inviaDomanda(e) {
		e.preventDefault();
		const form = e.target;
		const dati = {
			domanda: form.domanda.value,
			categoria: form.categoria.value,
		};
		const radios = form.querySelectorAll("input[type=radio]");
		let j = 2;
		for (let i = 0; i < 4; i++) {
			if (radios[i].checked) dati["rispostaCorretta"] = form["risposta" + (i + 1)].value;
			else dati["risposta" + j++] = form["risposta" + (i + 1)].value;
		}

		const req = new XMLHttpRequest();
		req.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				// eslint-disable-next-line no-undef
				$("#popup-successo").modal();
			}
		};
		req.open("POST", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/aggiungi-domanda.php");
		req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		req.withCredentials = true;
		req.send(JSON.stringify(dati));

		form.reset();
	}

	render() {
		const options = this.state.categorie.map((el) => {
			return { value: el, label: el };
		});
		const styles = {
			container: (provided) => ({ ...provided, padding: "0 !important" }),
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
		return (
			<div className="aggiungi-domanda w-100">
				<div className="row">
					<div className="col-12 text-center">
						<img src={Logo} className="w-50 iqfight-logo" alt="Logo di IQFight"></img>
					</div>
				</div>
				<div className="row centra">
					<div className="col-12 col-sm-8 col-lg-8">
						<p className="titolo text-center"> Aggiungi domanda </p>
						<form className="d-flex flex-column w-100 centra" onSubmit={this.inviaDomanda}>
							<Select
								name="categoria"
								options={options}
								className="form-control-lg"
								styles={styles}
								placeholder="Categoria"
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
							<textarea placeholder="Domanda" className="form-control-lg shadow" required name="domanda" maxLength="100"></textarea>
							<InputToggle
								placeholder="Risposta 1"
								className="form-control-lg shadow"
								radio
								name="risposta1"
								radioName="rispostaCorretta"
								checked
								maxLength="20"
								required></InputToggle>
							<InputToggle
								placeholder="Risposta 2"
								className="form-control-lg shadow"
								radio
								name="risposta2"
								radioName="rispostaCorretta"
								maxLength="20"
								required></InputToggle>
							<InputToggle
								placeholder="Risposta 3"
								className="form-control-lg shadow"
								radio
								name="risposta3"
								radioName="rispostaCorretta"
								maxLength="20"
								required></InputToggle>
							<InputToggle
								placeholder="Risposta 4"
								className="form-control-lg shadow"
								radio
								name="risposta4"
								radioName="rispostaCorretta"
								maxLength="20"
								required></InputToggle>
							<input type="submit" className="bottone shadow" value="Invia"></input>
						</form>
					</div>
				</div>

				<div className="modal fade" id="popup-successo" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
					<div className="modal-dialog" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Aggiungi domanda</h5>
								<button type="button" className="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">Domanda inserita con successo, grazie per la tua collaborazione!</div>
							<div className="modal-footer">
								<button type="button" className="bottone" data-dismiss="modal">
									Ok
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
