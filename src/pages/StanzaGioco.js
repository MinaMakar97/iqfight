import React from "react";
import "./StanzaGioco.css";
import Card from "../components/Card";
import logo from "../img/iqfight-logo.png";
import userImage from "../img/user.png";
import "./SalaAttesa.css";
class StanzaGioco extends React.Component {
	constructor() {
		super();
		this.state = {
			domanda: "",
			risposta1: "",
			risposta2: "",
			risposta3: "",
			risposta4: "",
		};
		this.width = window.innerWidth;
	}

	componentDidMount() {
		this.setState({
			domanda: "ciao come ti chiami io sono mina e noaxBIUqcbjvbajh jhcxvjh ujhgasvc jaissdgc",
			risposta1: "Mina",
			risposta2: "Emanuele",
			risposta3: "Fabrizio",
			risposta4: "Matteo",
		});
	}

	render() {
		return (
			<div className="pagina-classifica w-100 h-100 flex-column centra">
				{this.width < 576 ? <img src={logo} alt="Logo" className="mb-4"></img> : null}
				<div className="row w-100 div-princ mt-3">
					<div className="col-12 col-sm-8 mt-4">
						<div className="progress mb-4">
							<div
								className="progress-bar progress-bar-striped"
								role="progressbar"
								style={{ width: "100%", height: "100%" }}
								aria-valuenow="10"
								aria-valuemin="0"
								aria-valuemax="100"></div>
						</div>
						<div className="domanda mb-4 centra">{this.state.domanda}</div>
						<div className="div-domanda row">
							<div className="risposta mb-4 centra">{this.state.risposta1}</div>
							<div className="risposta mb-4 centra">{this.state.risposta2}</div>
						</div>
						<div className="div-domanda row">
							<div className="risposta mb-4 centra">{this.state.risposta3}</div>
							<div className="risposta mb-4 centra">{this.state.risposta4}</div>
						</div>
					</div>
					<div className="col-12 col-sm-1 centra">
						<hr className="riga"></hr>
					</div>
					<div className="col-12 col-sm-3 centra flex-column">
						{this.width >= 576 ? <img src={logo} alt="Logo" className="mb-4"></img> : null}
						<div className=" giocatori ">
							<div style={{ color: "#8B6EDD", paddingTop: "1em", fontSize: "large" }}>Giocatori</div>
							<Card nome={"Mina Makar"} punteggio={"0 punti"} immagine={userImage} style={{ width: "90%" }}></Card>
							<Card nome={"Fabrizio Rossi"} punteggio={"0 punti"} immagine={userImage} style={{ width: "90%" }}></Card>
							<Card nome={"Matteo Orsini"} punteggio={"0 punti"} immagine={userImage} style={{ width: "90%" }}></Card>
							<Card nome={"Mina Makar"} punteggio={"0 punti"} immagine={userImage} style={{ width: "90%" }}></Card>
							<Card nome={"Fabrizio Rossi"} punteggio={"0 punti"} immagine={userImage} style={{ width: "90%" }}></Card>
							<Card nome={"Matteo Orsini"} punteggio={"0 punti"} immagine={userImage} style={{ width: "90%" }}></Card>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default StanzaGioco;
