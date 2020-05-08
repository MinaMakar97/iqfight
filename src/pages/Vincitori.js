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
	}

	creaGiocatori() {
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

	render() {
		return (
			<div className="pagina-classifica pagina-vincitore w-100 h-100 flex-column centra">
				<img src={logo} alt="Logo"></img>
				<p className="centra" style={{ color: "white", fontSize: "1em", marginTop: "1em" }}>
					{" "}
					Complimenti a me per questo risultato
				</p>
				<div className="div-card">{this.creaGiocatori()}</div>
				{/* <hr className="riga"></hr> */}
				<div className="row">
					<div className="col-12 col-sm-6 centra">
						<Link>
							<button type="submit" className="shadow bottone mb-4">
								Torna alla Home
							</button>
						</Link>
					</div>
					<div className="col-12 col-sm-6 centra">
						<Link>
							<button type="submit" className="shadow bottone mb-4">
								Gioca ancora
							</button>
						</Link>
					</div>
				</div>
			</div>
		);
	}
}

export default Vincitori;
