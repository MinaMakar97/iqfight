import React from "react";
import Card from "../components/Card";
import userImage from "../img/user.png";
import logo from "../img/iqfight-logo.png";
import "./Classifica.css";
import "./Vincitori.css";
import { Link } from "react-router-dom";

class Vincitori extends React.Component {
  render() {
    return (
      <div className="pagina-classifica pagina-vincitore w-100 h-100 flex-column centra">
        <img src={logo} alt="Logo"></img>
        <p className="centra" style={{ color: "white", fontSize: "1em", marginTop: "1em" }}>
          {" "}
          Complimenti a me per questo risultato
        </p>
        <div className="div-card">
          <Card
            className={"primo-classifica"}
            nome={"Mina Makar"}
            punteggio={"1000 punti"}
            posizione={"1°"}
            immagine={userImage}
            style={{ animationDelay: 1 * 0.25 + "s", width: "100%" }}
          ></Card>
          <Card
            className={"secondo-classifica"}
            nome={"Fabrizio Rossi"}
            punteggio={"500 punti"}
            posizione={"2°"}
            immagine={userImage}
            style={{ animationDelay: 2 * 0.25 + "s", width: "90%" }}
          ></Card>
          <Card
            className={"terzo-classifica"}
            nome={"Matteo Orsini"}
            punteggio={"200 punti"}
            posizione={"3°"}
            immagine={userImage}
            style={{ animationDelay: 3 * 0.25 + "s", width: "80%" }}
          ></Card>
        </div>
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
