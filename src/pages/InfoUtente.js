import React from "react";
import logo from "../img/iqfight-logo.png";
import "./InfoUtente.css";
import CardInfo from "../components/CardInfo";
import avatarPredefinito from "../img/user.png";
import statics from "../img/statics.svg";
import check from "../img/check.svg";
import crown from "../img/crown.svg";
import sword from "../img/sword.svg";

class InfoUtente extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			risposteCorrette: "",
			partiteVinte: "",
			partiteGiocate: "",
			username: "",
			email: "",
			modificaUsername: false,
			modificaEmail: false,
			modificaPassword: false,
			errore: "",
		};
		this.changeForm = this.changeForm.bind(this);
		this.modfica = this.modifica.bind(this);
		this.invia = this.invia.bind(this);
	}

	invia(e) {
		if (e.key === "Enter") {
			let id = e.target.id;
			if (id === "user") {
				this.setState({
					modificaUsername: false,
				});
				this.cambiaInfo("username", e.target.value);
			} else if (id === "mail") {
				this.setState({
					modificaEmail: false,
				});
				this.cambiaInfo("email", e.target.value);
			} else if (id === "pass") {
				this.setState({
					modificaPassword: false,
				});
				this.cambiaInfo("password", e.target.value);
			}
		}
	}

	cambiaInfo(titolo, cambio) {
		let xml = new XMLHttpRequest();
		let json = { azione: titolo, cambio: cambio };
		xml.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				let json = JSON.parse(e.target.responseText);
				if (json["successo"] === false) {
					document.getElementById("err-log").textContent = json["motivazione"];
					document.getElementById("err-log").style.display = "inline";
				}
			}
		};
		xml.open("POST", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/info-utente.php");
		xml.withCredentials = true;
		xml.send(JSON.stringify(json));
	}

	changeForm(e) {
		if (e.target.id === "username") {
			this.setState({
				modificaUsername: true,
			});
		} else if (e.target.id === "email") {
			this.setState({
				modificaEmail: true,
			});
		} else if (e.target.id === "password") {
			this.setState({
				modificaPassword: true,
			});
		}
	}

	componentDidMount() {
		let xml = new XMLHttpRequest();
		xml.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				let json = JSON.parse(e.target.responseText);
				if (json["successo"] === true) {
					this.setState({
						risposteCorrette: json["risposteGiuste"],
						partiteVinte: json["partiteVinte"],
						partiteGiocate: json["partiteGiocate"],
						username: json["username"],
						email: json["email"],
					});
				}
			}
		};
		xml.open("GET", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/info-utente.php");
		xml.withCredentials = true;
		xml.send();
	}

	img(s) {
		return <img alt="Avatar utente" src={s} style={{ width: "40px" }}></img>;
	}

	modifica(id) {
		return (
			<div
				id={id}
				className="col-5 col-sm-3 w-100 h-100 p-0"
				style={{ textAlign: "right", color: "var(--colore-quart)" }}
				onClick={this.changeForm}>
				modifica
			</div>
		);
	}

	render() {
		return (
			<div className="pagina-classifica w-100 h-100 flex-column centra p-0">
				<img src={logo} alt="Logo" className="iqfight-logo"></img>
				<div className="row w-100 h-100 p-0 pt-1 mb-4 info-princ">
					<div className="col-12 col-sm-6 h-100 p-0">
						<div className="info-utente flex-column centra">
							<img
								alt="Avatar utente"
								className="mb-4 mt-4"
								src={avatarPredefinito}
								style={{ width: "130px", height: "130px", borderRadius: "100%" }}></img>

							<p style={{ display: "none" }} id="err-log"></p>

							<CardInfo
								tipo="text"
								nomeSezione={"Nome utente"}
								id="user"
								sezione={this.state.username}
								style={{ width: "100%" }}
								html={this.modifica("username")}
								invia={this.invia}
								disabled={!this.state.modificaUsername}></CardInfo>
							<CardInfo
								tipo="email"
								id="mail"
								nomeSezione={"Email"}
								sezione={this.state.email}
								style={{ width: "100%" }}
								tronca={true}
								invia={this.invia}
								html={this.modifica("email")}
								disabled={!this.state.modificaEmail}></CardInfo>
							<CardInfo
								tipo="password"
								id="pass"
								nomeSezione={"Password"}
								sezione={"*******"}
								style={{ width: "100%" }}
								invia={this.invia}
								html={this.modifica("password")}
								disabled={!this.state.modificaPassword}></CardInfo>
						</div>
					</div>

					<div class="col-12 col-sm-6 h-100 p-0">
						<div className="statistiche centra flex-column">
							<img
								alt="Avatar utente"
								className="mb-4 mt-4"
								src={statics}
								style={{ width: "130px", height: "130px", borderRadius: "100%" }}></img>
							<CardInfo
								nomeSezione={"Risposte corrette"}
								sezione={this.state.risposteCorrette}
								style={{ width: "100%" }}
								html={this.img(check)}></CardInfo>
							<CardInfo
								nomeSezione={"Partite vinte"}
								sezione={this.state.partiteVinte}
								style={{ width: "100%" }}
								html={this.img(crown)}></CardInfo>
							<CardInfo
								nomeSezione={"Partite giocate"}
								sezione={this.state.partiteGiocate}
								style={{ width: "100%" }}
								html={this.img(sword)}></CardInfo>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default InfoUtente;
