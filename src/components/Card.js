import React from "react";
import "./Classifica.css";

class Card extends React.Component{
    render(){
        return <div className="card shadow mt-3 mt-lg-4">
            {/* la prima colonna */}
            <div className="dis-img">
                <img src={this.props.imagine} className="img-card"/> 
            </div>

            {/* la seconda colonna */}
            <div className="dis-text">
                <div className="font-weight-bold a">
                    {this.props.nome}
                </div>
                <div className="text-muted a">
                    {this.props.punteggio}
                </div>
            </div>


        </div>
    }
}
export default Card;