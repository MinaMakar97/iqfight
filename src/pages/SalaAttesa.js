import React from "react";
import logo from "../img/iqfight-logo.png";
import CardInfo from "../components/CardInfo";
import "./SalaAttesa.css"
import Card from "../components/Card";
import userImage from "../img/user.png";

class StanzaAttesa extends React.Component{
    render(){
        return <div className="pagina-classifica w-100 h-100 flex-column centra">
            <img src={logo} alt="Logo"></img>
            <p className="centra" style={{color:"white", fontSize:"2em", marginTop:".5em"}}>Sala d'attesa</p>
            <div className="row w-100 div-princ mt-3" >
                <div className="col-12 col-sm-8">
                    <CardInfo nomeSezione={"Nome stanza"} sezione={"Stanza numero 1"} style={{width: "100%"}}></CardInfo>
                    <div className="row">
                        <div className={"col-12 col-sm-6"}><CardInfo nomeSezione={"Categoria"} sezione={"Domande casuali"} style={{width: "100%"}}></CardInfo></div>
                        <div className={"col-12 col-sm-6"}><CardInfo nomeSezione={"Visbilità stanza"} sezione={"privata"} style={{width: "100%"}}></CardInfo></div>
                    </div>
                    <CardInfo nomeSezione={"Link stanza"} sezione={"http://iqfight.altervista.org/2354987"} style={{width: "100%"}}></CardInfo>
                </div>
                <div className="col-12 col-sm-1">
                    <hr className="riga"></hr>
                </div>

                <div className="col-12 col-sm-3 giocatori">
                    <div style={{color:"#8B6EDD",paddingTop:"1em", fontSize:"large"}}>Giocatori</div>
                    <Card nome={"Mina Makar"} punteggio={"0 punti"} immagine ={userImage} style={{width: "90%"}}></Card>
                    <Card nome={"Fabrizio Rossi"} punteggio={"0 punti"}immagine ={userImage} style={{width: "90%"}}></Card>
                    <Card nome={"Matteo Orsini"} punteggio={"0 punti"} immagine ={userImage} style={{width: "90%"}}></Card>

                    <Card nome={"Mina Makar"} punteggio={"0 punti"} immagine ={userImage} style={{width: "90%"}}></Card>
                    <Card nome={"Fabrizio Rossi"} punteggio={"0 punti"}immagine ={userImage} style={{width: "90%"}}></Card>
                    <Card nome={"Matteo Orsini"} punteggio={"0 punti"} immagine ={userImage} style={{width: "90%"}}></Card>
                </div>
            </div>
                <div className="centra mt-4" >
					<button className="bottone">Avvia</button>
				</div>
        </div>
    }
}

export default StanzaAttesa;