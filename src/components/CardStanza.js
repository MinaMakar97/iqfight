import React, { Component } from "react";
import "./CardStanza.css";

export const immaginiCard = {
	Arte: { url: "url(https://i.pinimg.com/originals/91/34/01/913401dc3ca38e3d07a2f1a6ad516d21.jpg)", position: "20% 0%" },
	Geografia: {
		url: "url(https://static.vecteezy.com/system/resources/previews/000/533/675/non_2x/vector-dotted-world-map-on-a-blue-background.jpg)",
		position: "0% 0%",
	},
	Giochi: { url: "url(https://mcdn.wallpapersafari.com/medium/59/96/7jsr3k.jpg", position: "17% 52%" },
	Informatica: {
		url: "url(https://s3.amazonaws.com/fullstackfeed/images/ai-2.jpg)",
		position: "27% 15%",
	},
	Lingue: { url: "url(https://www.eduforma.it/wp-content/uploads/2019/12/8314929977_28fd740070_b.jpg)", position: "0% 0%" },
	Scienze: {
		url: "url(https://img.freepik.com/foto-gratuito/sfondo-di-scienza-con-molecola-o-atomo_36845-80.jpg?size=626&ext=jpg)",
		position: "67% 14%",
	},
	Spettacolo: {
		url:
			"url(https://thumbs.dreamstime.com/b/stage-podium-show-vector-illustration-illuminated-spotlights-empty-runway-fashion-blue-background-138447022.jpg)",
		position: "0% 0%",
	},
	Storia: {
		url: "url(https://c4.wallpaperflare.com/wallpaper/98/436/868/aviation-background-eiffel-tower-paris-font-hd-wallpaper-preview.jpg)",
		position: "0% 0%",
	},
};

export default class CardStanza extends Component {
	render() {
		return (
			<div
				className="card-stanza"
				style={{
					background: immaginiCard[this.props.categoria].url,
					backgroundRepeat: "no-repeat",
					backgroundPosition: immaginiCard[this.props.categoria].position,
				}}>
				<div className="div-info">
					<p className="nome-stanza">{this.props.nomeStanza}</p>
					<p className="categoria-stanza">{this.props.categoria}</p>
				</div>
				<div className="div-giocatori">
					<span className="num-giocatori">{this.props.numGiocatori}</span>
					<span className="max-giocatori"> / {this.props.maxGiocatori}</span>
				</div>
				<i className="fas fa-caret-right freccia"></i>
			</div>
		);
	}
}
