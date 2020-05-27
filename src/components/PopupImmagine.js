import React, { Component } from "react";
import "./PopupImmagine.css";
import ImgUtente from "../img/user.png";

export default class Popup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			immagine: this.props.immagine + "?" + new Date().getTime(),
			zoom: 1,
			top: 0,
			left: 0,
			prevDrag: { x: 0, y: 0 },
			ruota: 0,
			distanzaPinch: 0,
		};

		this.canvas = React.createRef();
		this.cambiaImmagine = this.cambiaImmagine.bind(this);
		this.gestisciImmagine = this.gestisciImmagine.bind(this);
		this.gestisciZoom = this.gestisciZoom.bind(this);
		this.gestisciSposta = this.gestisciSposta.bind(this);
		this.gestisciMouseDown = this.gestisciMouseDown.bind(this);
		this.gestisciMouseUp = this.gestisciMouseUp.bind(this);
		this.ruotaDestra = this.ruotaDestra.bind(this);
		this.ruotaSinistra = this.ruotaSinistra.bind(this);
		this.salvaImmagine = this.salvaImmagine.bind(this);
		this.ridimensiona = this.ridimensiona.bind(this);

		this.image = new Image();
		this.image.crossOrigin = "Anonymous";
		this.image.src = this.props.immagine + "?" + new Date().getTime() || ImgUtente;
	}

	gestisciImmagine(e) {
		const file = e.target.files[0];
		if (file) this.cambiaImmagine(URL.createObjectURL(file));
		e.target.value = "";
	}

	cambiaImmagine(imgSrc) {
		this.image.src = imgSrc;
		this.setState({ immagine: imgSrc + "?" + new Date().getTime() });
	}

	gestisciZoom(e) {
		e.preventDefault();
		const deltaY = -e.deltaY;
		this.setState((prevState) => {
			let scale = prevState.zoom * 0.001;
			let newZoom = prevState.zoom + deltaY * scale;
			newZoom = Math.max(0, newZoom);
			return { zoom: newZoom };
		});
	}

	gestisciSposta(e) {
		e.preventDefault();
		if (e.targetTouches) {
			if (e.targetTouches.length === 1)
				// Panning
				e = e.targetTouches[0];
			else {
				// Zooming
				const touch1 = e.targetTouches[0];
				const touch2 = e.targetTouches[1];
				const distanza = Math.abs(touch1.pageX - touch2.pageX);
				let newZoom;
				const max = Math.max(this.image.width, this.image.height);
				const scale = 15;
				if (distanza < this.state.distanzaPinch) newZoom = this.state.zoom - scale / max;
				else newZoom = this.state.zoom + scale / max;
				this.setState({ distanzaPinch: distanza, zoom: Math.max(0, newZoom) });
				return;
			}
		}
		const deltaX = e.pageX - this.state.prevDrag.x;
		const deltaY = e.pageY - this.state.prevDrag.y;
		this.setState((prevState) => ({
			left: prevState.left + deltaX,
			top: prevState.top + deltaY,
			prevDrag: { x: e.pageX, y: e.pageY },
		}));
	}

	gestisciMouseDown(e) {
		e.preventDefault();
		let pageX,
			pageY,
			move,
			up,
			distanza = 0;
		// Desktop
		if (e.pageX) {
			pageX = e.pageX;
			pageY = e.pageY;
			move = "mousemove";
			up = "mouseup";
		}
		// Mobile
		else {
			pageX = e.targetTouches[0].pageX;
			pageY = e.targetTouches[0].pageY;
			move = "touchmove";
			up = "touchend";
			if (e.targetTouches.length > 1) distanza = Math.abs(e.targetTouches[0].pageX - e.targetTouches[1].pageX);
		}
		this.setState({ prevDrag: { x: pageX, y: pageY }, distanzaPinch: distanza });
		document.addEventListener(move, this.gestisciSposta);
		document.addEventListener(up, this.gestisciMouseUp);
	}

	gestisciMouseUp(e) {
		e.preventDefault();
		const move = e.targetTouches ? "touchmove" : "mousemove";
		const up = e.targetTouches ? "touchend" : "mouseup";
		document.removeEventListener(move, this.gestisciSposta);
		document.removeEventListener(up, this.gestisciMouseUp);
	}

	ruotaDestra(e) {
		this.setState((prevState) => ({ ruota: prevState.ruota + Math.PI / 2 }));
	}

	ruotaSinistra(e) {
		this.setState((prevState) => ({ ruota: prevState.ruota - Math.PI / 2 }));
	}

	salvaImmagine() {
		const canvas = this.canvas.current;
		const ctx = canvas.getContext("2d");
		const w = canvas.width;
		const h = canvas.height;
		let imgData;
		if (w > h) {
			imgData = ctx.getImageData(w / 2 - h / 2, 0, w / 2 + h / 2, h);
		} else {
			imgData = ctx.getImageData(0, h / 2 - w / 2, w, h / 2 + w / 2);
		}

		const newCanvas = document.createElement("canvas");
		const min = Math.min(w, h);
		newCanvas.width = min;
		newCanvas.height = min;
		const newCtx = newCanvas.getContext("2d");
		newCtx.putImageData(imgData, 0, 0);
		const newImg = newCanvas.toDataURL("image/png");

		let formData = new FormData();
		formData.append("avatar", newImg);

		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				let json = JSON.parse(e.target.responseText);
				if (json["successo"] === true) {
					if (this.props.salva) this.props.salva(json);
				}
			}
		};
		xhr.withCredentials = true;
		xhr.open("POST", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/carica-immagine.php");
		xhr.send(formData);
	}

	disegnaGriglia(canvas) {
		const ctx = canvas.getContext("2d");
		const n = 30;
		const lung = Math.ceil(Math.max(canvas.width, canvas.height) / n);
		for (let y = 0; y < n; y++) {
			for (let x = 0; x < n; x++) {
				ctx.fillStyle = (x + y) % 2 === 0 ? "white" : "#ddd";
				ctx.fillRect(x * lung, y * lung, lung, lung);
			}
		}
	}

	componentDidUpdate() {
		const canvas = this.canvas.current;
		const ctx = canvas.getContext("2d");
		ctx.save();
		this.disegnaGriglia(canvas);
		ctx.translate(this.state.left, this.state.top);
		ctx.scale(this.state.zoom, this.state.zoom);
		ctx.rotate(this.state.ruota);
		ctx.translate(-this.image.width / 2, -this.image.height / 2);
		ctx.drawImage(this.image, 0, 0);
		ctx.restore();
	}

	ridimensiona() {
		const canvas = this.canvas.current;
		canvas.width = canvas.parentElement.offsetWidth;
		canvas.height = canvas.parentElement.offsetHeight;
		const divCerchio = canvas.nextElementSibling;
		const dimensioneMin = Math.min(canvas.width, canvas.height);
		divCerchio.style.width = dimensioneMin + "px";
		divCerchio.style.height = dimensioneMin + "px";
		this.componentDidUpdate();
	}

	componentDidMount() {
		const canvas = this.canvas.current;

		canvas.addEventListener("wheel", this.gestisciZoom);
		canvas.addEventListener("mousedown", this.gestisciMouseDown);
		canvas.addEventListener("touchstart", this.gestisciMouseDown);

		this.image.onload = () => {
			const zoom = Math.max(canvas.height / this.image.height, canvas.width / this.image.width);
			this.setState({
				immagine: this.image.src,
				zoom: zoom,
				left: canvas.width / 2,
				top: canvas.height / 2,
			});
		};

		this.ridimensiona();
		window.addEventListener("resize", this.ridimensiona);
	}

	componentWillUnmount() {
		const canvas = this.canvas.current;
		canvas.removeEventListener("wheel", this.gestisciZoom);
		// togli listener mobile
		canvas.removeEventListener("mousedown", this.gestisciMouseDown);
		window.removeEventListener("resize", this.ridimensiona);
		this.image.onload = null;
	}

	render() {
		return (
			<div className="iqfight-popup" onMouseDown={this.props.annulla}>
				<div className="iqfight-popup-bg" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
					<div className="row div-immagine">
						<canvas ref={this.canvas}></canvas>
						<div className="cerchio-img"></div>
					</div>
					<div className="div-controlli row">
						<i className="fas fa-undo" onClick={this.ruotaSinistra}></i>
						<i className="fas fa-trash-alt" onClick={() => this.cambiaImmagine(ImgUtente)}></i>
						<i className="fas fa-undo fa-flip-horizontal" onClick={this.ruotaDestra}></i>
					</div>
					<div className="row">
						<label className="carica-immagine">
							Carica immagine
							<input type="file" accept="image/*" hidden onChange={this.gestisciImmagine}></input>
						</label>
					</div>
					<div className="div-pulsanti row">
						<button className="annulla" onClick={this.props.annulla}>
							Annulla
						</button>
						<button className="salva" onClick={this.salvaImmagine}>
							Salva
						</button>
					</div>
				</div>
			</div>
		);
	}
}
