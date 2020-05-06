import React from "react";
import { Link } from "react-router-dom";

class FormRegistrazione extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			filePath: "",
		};

		this.cambiaFile = this.cambiaFile.bind(this);
		this.registerSubmit = this.registerSubmit.bind(this);
	}

	cambiaFile(e) {
		this.setState({
			filePath: e.target.files[0].name,
		});
	}

	inviaRegistrazione(json, avatar, file) {
		let xml = new XMLHttpRequest();
		xml.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				let json = JSON.parse(e.target.responseText);
				if (json["successo"] === true) {
					if (avatar !== "") this.inviaImmagine(file);
					else window.location.replace("/login");
				} else {
					document.getElementById("err-log").textContent = json["motivazione"];
					document.getElementById("err-log").style.display = "inline";
				}
			}
		};
		xml.open("POST", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/registrazione.php");
		xml.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xml.send(JSON.stringify(json));
	}

	inviaImmagine(file) {
		let formData = new FormData();
		formData.append("avatar", file);
		let xmlImage = new XMLHttpRequest();
		xmlImage.withCredentials = true;
		xmlImage.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				let json = JSON.parse(e.target.responseText);
				if (json["successo"] === true) window.location.replace("/login");
				else {
					document.getElementById("err-log").textContent = json["motivazione"];
					document.getElementById("err-log").style.display = "inline";
				}
			}
		};
		xmlImage.open("POST", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/carica-immagine.php");
		xmlImage.send(formData);
	}

	registerSubmit(e) {
		e.preventDefault();

		let json = {};
		let username = e.target.username.value;
		let password = e.target.password.value;
		let email = e.target.email.value;
		json = { username: username, password: password, email: email };
		let avatar = e.target.avatar.value;
		let file = e.target.avatar.files[0];

		this.inviaRegistrazione(json, avatar, file);
	}

	render() {
		return (
			<div className="loginn">
				<p style={{ color: "white", fontSize: "2em" }}> Registrazione</p>
				<form className="form" onSubmit={this.registerSubmit}>
					<input className="form-control-lg shadow mb-4" maxLength="40" type="email" placeholder="Email" name="email" required></input>
					<input className="form-control-lg shadow mb-4" maxLength="15" type="text" placeholder="Username" name="username" required></input>
					<input
						className="form-control-lg shadow mb-4"
						maxLength="50"
						type="password"
						placeholder="Password"
						name="password"
						required></input>
					<div className="form-control-lg shadow" style={{ borderRadius: "10px", display: "flex", backgroundColor: "white" }}>
						<div style={{ color: "#c1b1ec" }}>Avatar</div>
						<p id="name-avatar" className="sfoglia">
							{this.state.filePath}
						</p>
						<label className="contorno centra">
							Sfoglia
							<input type="file" name="avatar" style={{ display: "none" }} onChange={this.cambiaFile}></input>
						</label>
					</div>
					<div className="termini-cond mt-3">
						<input className="form-check-input" type="checkbox" value="" id="defaultCheck1" required />
						<label className="form-check-label" htmlFor="defaultCheck1">
							Accetto i termini di servizio
						</label>
					</div>
					<p style={{ display: "none", marginTop: "1em" }} id="err-log"></p>

					<div className="centra">
						<button type="submit" className="shadow bottone mt-3 mb-4">
							Entra
						</button>
					</div>
				</form>
				<Link to="/login">
					<p style={{ color: "blue", textAlign: "center" }}>Indietro</p>{" "}
				</Link>
			</div>
		);
	}
}

export default FormRegistrazione;
