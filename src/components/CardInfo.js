import React from "react";
import "./CardInfo.css"

class CardInfo extends React.Component{
    render(){
        return <div className={"div-card " + this.props.className} style={this.props.style}>
            <div className="row nome-sezione w-100"> {this.props.nomeSezione}</div>
            <div className="row sezione"> {this.props.sezione} </div>
        </div>

        
    }
}

export default CardInfo;