import React from "react";
import logo from "../img/iqfight-logo.png";
import "./InfoUtente.css";
import CardInfo from "../components/CardInfo";
import avatarPredefinito from "../img/user.png";
import statics from "../img/statics.svg";
import check from "../img/check.svg";
import crown from "../img/crown.svg";
import sword from "../img/sword.svg";
import PopupImmagine from "../components/PopupImmagine";

class InfoUtente extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			risposteCorrette: "",
			partiteVinte: "",
			partiteGiocate: "",
			username: "",
			email: "",
			avatar: avatarPredefinito,
			modificaUsername: false,
			modificaEmail: false,
			modificaPassword: false,
			errore: "",
			message: "",
			mostraPopup: false,
			precedente: "",
		};
		this.changeForm = this.changeForm.bind(this);
		this.modfica = this.modifica.bind(this);
		this.invia = this.invia.bind(this);
	}

	invia(e) {
		document.getElementById("err-log").textContent = "";
		document.getElementById("err-log").style.display = "none";
		if (e.key === "Enter") {
			let id = e.target.id;
			if (id === "user") {
				if (this.cambiaInfo("username", e.target.value)) {
					this.setState({
						modificaUsername: false,
					});
				}
			} else if (id === "mail") {
				if (this.cambiaInfo("email", e.target.value)) {
					this.setState({
						modificaEmail: false,
					});
				}
			} else if (id === "pass") {
				if (this.cambiaInfo("password", e.target.value)) {
					this.setState({
						modificaPassword: false,
					});
				}
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
				} else {
					this.setState({ message: json["messaggio"] });
					// eslint-disable-next-line no-undef
					$("#popup-successo").modal();
				}
			}
		};
		xml.open("POST", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/info-utente.php");
		xml.withCredentials = true;
		xml.send(JSON.stringify(json));
	}

	changeForm(e) {
		if (e.target.id === "username" || e.target.id === "user") {
			if (e.target.id === "username") this.setState({ precedente: document.getElementById("user").value });
			else {
				document.getElementById("user").value = this.state.precedente;
			}
			this.setState({
				modificaUsername: !this.state.modificaUsername,
			});
		} else if (e.target.id === "email" || e.target.id === "mail") {
			if (e.target.id === "email") this.setState({ precedente: document.getElementById("mail").value });
			else {
				document.getElementById("mail").value = this.state.precedente;
			}
			this.setState({
				modificaEmail: !this.state.modificaEmail,
			});
		} else if (e.target.id === "password" || e.target.id === "pass") {
			if (e.target.id === "password") this.setState({ precedente: document.getElementById("pass").value });
			else {
				document.getElementById("pass").value = this.state.precedente;
			}
			this.setState({
				modificaPassword: !this.state.modificaPassword,
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
						avatar: json["avatar"] != null ? process.env.REACT_APP_LOCAL_ENDPOINT + json["avatar"] : this.state.avatar,
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
				className="modifica col-5 col-sm-3 p-0"
				style={{ textAlign: "right", color: "var(--colore-quart)" }}
				onClick={this.changeForm}>
				modifica
			</div>
		);
	}

	render() {
		return (
			<div className="pagina-classifica w-100 h-100 flex-column centra p-0">
				{this.state.mostraPopup ? (
					<PopupImmagine
						annulla={() => this.setState({ mostraPopup: false })}
						immagine={this.state.avatar}
						salva={(json) => {
							this.setState({ mostraPopup: false, message: json["messaggio"] });
							// eslint-disable-next-line no-undef
							$("#popup-successo").modal();
						}}></PopupImmagine>
				) : null}
				<img src={logo} alt="Logo" className="iqfight-logo"></img>
				<div className="row w-100 h-100 p-0 pt-1 mb-4 info-princ">
					<div className="col-12 col-sm-6 h-100 p-0">
						<div className="info-utente flex-column centra">
							<div
								style={{ width: "150px", height: "150px", position: "relative" }}
								className="mb-4 mt-4"
								onClick={() => this.setState({ mostraPopup: true })}>
								<img alt="Avatar utente" src={this.state.avatar} style={{ width: "95%", height: "95%", borderRadius: "100%" }}></img>
								<div className="cerchio-penna centra">
									<i className="penna fas fa-pen"></i>
								</div>
							</div>

							<p style={{ display: "none" }} id="err-log"></p>

							<CardInfo
								modifica={true}
								tipo="text"
								nomeSezione={"Nome utente"}
								id="user"
								sezione={this.state.username}
								style={{ width: "100%" }}
								html={this.modifica("username")}
								invia={this.invia}
								onBlur={this.changeForm}
								disabled={!this.state.modificaUsername}></CardInfo>
							<CardInfo
								modifica={true}
								tipo="email"
								id="mail"
								nomeSezione={"Email"}
								sezione={this.state.email}
								style={{ width: "100%" }}
								tronca={true}
								invia={this.invia}
								html={this.modifica("email")}
								onBlur={this.changeForm}
								disabled={!this.state.modificaEmail}></CardInfo>
							<CardInfo
								modifica={true}
								tipo="password"
								id="pass"
								nomeSezione={"Password"}
								sezione={"*******"}
								style={{ width: "100%" }}
								invia={this.invia}
								html={this.modifica("password")}
								onBlur={this.changeForm}
								disabled={!this.state.modificaPassword}></CardInfo>
						</div>
					</div>

					<div className="col-12 col-sm-6 h-100 p-0">
						<div className="statistiche centra flex-column">
							<div
								style={{ width: "150px", height: "150px", borderRadius: "100%", backgroundColor: "var(--colore-terz)" }}
								className="mb-4 mt-4 centra">
								<img alt="Avatar utente" src={statics} style={{ width: "100%", height: "100%", borderRadius: "100%" }}></img>
							</div>
							<CardInfo
								modifica={false}
								tipo="text"
								nomeSezione={"Risposte corrette"}
								sezione={this.state.risposteCorrette}
								style={{ width: "100%" }}
								disabled={true}
								html={this.img(check)}></CardInfo>
							<CardInfo
								modifica={false}
								tipo="text"
								nomeSezione={"Partite vinte"}
								sezione={this.state.partiteVinte}
								style={{ width: "100%" }}
								disabled={true}
								html={this.img(crown)}></CardInfo>
							<CardInfo
								modifica={false}
								tipo="text"
								nomeSezione={"Partite giocate"}
								sezione={this.state.partiteGiocate}
								style={{ width: "100%" }}
								disabled={true}
								html={this.img(sword)}></CardInfo>
						</div>
					</div>
				</div>
				<div className="modal fade" id="popup-successo" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
					<div className="modal-dialog modal-dialog-centered" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Operazione riuscita</h5>
								<button type="button" className="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">{this.state.message}</div>
							<div className="modal-footer">
								<button type="button" className="bottone" data-dismiss="modal" onClick={() => window.location.reload()}>
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

export default InfoUtente;
