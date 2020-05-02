import React, { Component } from "react";
import {isMobile} from 'react-device-detect';
import "./MenuLaterale.css"

class MenuLaterale extends Component{
    constructor (props){
        super(props); 
        this.cambiaColore = this.cambiaColore.bind(this);
        this.state = {boole: true};
        this.setta = this.setta.bind(this);
        
    }
    cambiaColore(id){
        document.getElementById(id).style.backgroundColor = "#0996BB";
    }

    componentDidMount(){
        if (isMobile) this.setState({boole : false});
        this.setta();
        this.cambiaColore(this.props.section);
    }

    setta(){
        if (!this.state.boole) {
            document.getElementById("div-menu-laterale").style.transform = "translateX(-100%)";
            this.setState({boole : true});
            document.getElementById("freccia").className = "arrow-left";
        }
        else {
            document.getElementById("div-menu-laterale").style.transform = "translateX(0px)";
            document.getElementById("freccia").className = "arrow-right";
            this.setState({boole : false});
        }

    }

    render(){
        return <div id="div-menu-laterale"> 
            <div id="menu-laterale">
                <hr className="riga-menu"></hr>
                <div className="div-content" id ="guida"> Guida</div>
                <hr className="riga-menu"></hr>
                <div className="div-content" id = "classifica"> Classifica</div>
                <hr className="riga-menu"></hr>
                <div className="div-content" id = "gioca"> Gioca</div>
                <hr className="riga-menu"></hr>
                <div className="div-content" id = "aggiungi-domanda"> Aggiungi Domanda</div>
                <hr className="riga-menu"></hr>
                <div className="div-content" id = "chi-siamo"> Chi Siamo</div>
                <hr className="riga-menu"></hr>
            </div>
            <div className="menu-button" onClick={this.setta}> <p id="freccia"></p></div>
        </div>
    }
}

export default MenuLaterale;