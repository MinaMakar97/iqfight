import React from "react";
import Card from "../components/Card";
import userImage from "../img/user.png";
import logo from "../img/iqfight-logo.png";
import "./Classifica.css";
import "./Vincitori.css";
import { Link } from "react-router-dom";

class Vincitori extends React.Component {
	constructor(props) {
		super(props);
		this.creaGiocatori = this.creaGiocatori.bind(this);
		this.giocaAncora = this.giocaAncora.bind(this);
		this.chiediStato = this.chiediStato.bind(this);
		this.updateInterval = null;
		this.refresh = 1000;
	}

	creaGiocatori() {
		const classiPodio = ["primo-classifica", "secondo-classifica", "terzo-classifica"];
		let cardGiocatori = [];
		let jGiocatori = this.props.giocatori;
		for (let i = 0; i < jGiocatori.length; i++) {
			cardGiocatori.push(
				<Card
					className={i < 3 ? classiPodio[i] : ""}
					nome={jGiocatori[i].username}
					punteggio={jGiocatori[i].punteggio}
					immagine={jGiocatori[i].avatar || userImage}
					style={{ animationDelay: i * 0.25 + "s", width: "" + 100 - i * 10 + "%" }}
					key={i}></Card>
			);
		}
		return cardGiocatori;
	}
	giocaAncora() {
		let xhr = new XMLHttpRequest();

		xhr.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				let json = JSON.parse(e.target.responseText);
				if (json["successo"] === true) this.props.cambia();
			}
		};
		xhr.open("POST", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/gioca-ancora.php");
		xhr.withCredentials = true;
		xhr.send();
	}

	chiediStato() {
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				let json = JSON.parse(e.target.responseText);
				if (json["successo"] === true) {
					if (json["iniziata"] === true) {
						clearInterval(this.updateInterval);
						this.props.cambia();
					}
				}
			}
		};
		xhr.open("GET", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/gioca-ancora.php");
		xhr.withCredentials = true;
		xhr.send();
	}
	componentDidMount() {
		this.updateInterval = setInterval(this.chiediStato, this.refresh);
	}

	componentWillUnmount() {
		clearInterval(this.updateInterval);
	}

	render() {
		return (
			<div className="pagina-classifica pagina-vincitore w-100 h-100 flex-column centra">
				<img src={logo} alt="Logo" className="iqfight-logo"></img>
				<p className="centra" style={{ color: "white", fontSize: "2em", marginTop: "1em", textAlign: "center" }}>
					{"Complimenti " + this.props.giocatori[0].username + ", hai vinto!"}
				</p>
				<div className="div-card">{this.creaGiocatori()}</div>
				{/* <hr className="riga"></hr> */}
				<div className="row">
					<div className="col-12 col-sm-6 centra">
						<Link to="/" replace>
							<button type="submit" className="shadow bottone mb-4">
								Torna alla Home
							</button>
						</Link>
					</div>
					<div className="col-12 col-sm-6 centra">
						<button type="submit" className="shadow bottone mb-4" onClick={this.giocaAncora}>
							Gioca ancora
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default Vincitori;
