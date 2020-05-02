import React from "react";
import { Link } from "react-router-dom";

class Login extends React.Component{
    constructor (props){
        super(props)
        this.loginSubmit = this.loginSubmit.bind(this);
    }
    loginSubmit(e){
        e.preventDefault();
        let json = {};
        let username = e.target.username.value;
        let password = e.target.password.value;
        json = {"username":username,"password":password};
        let xml = new XMLHttpRequest();
        xml.onreadystatechange = (e) => {
            if (e.target.readyState === 4 && e.target.status === 200) {
                let json = JSON.parse(e.target.responseText);
                if (json["successo"] === true) window.location.replace(json["url"]);
                else {
                    document.getElementById("form-log").reset();
                    document.getElementById("err-log").textContent = json["errore"];
                    document.getElementById("err-log").style.display = "inline";
                }
            }
        };
		xml.open("POST", "http://192.168.1.100/iqfight/login.php");
		xml.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xml.send(JSON.stringify(json));
    }

    render(){
       return <div className="loginn">
            <p className="titolo">Login</p>
            <form className="form" onSubmit={this.loginSubmit} id="form-log">
                <input type="text" maxLength="15" name = "username" className="shadow form-control-lg mb-4" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Username" required></input>
                <input type="password" name = "password" className="form-control-lg shadow mb-4" id="exampleInputPassword1" placeholder="Password" required></input>
                <p id="err-log" style={{display:"none"}}></p>
               <button type="submit" className="shadow bottone mb-4">Entra</button>
            </form>
            <div className="div-logo">
                <p style={{color: "white"}}> Non sei ancora registrato? </p>
                <Link to="/registrazione"><p style={{color: "blue",textAlign: "center"}}> Cosa aspetti, clicca qui! </p></Link>
            </div>
        </div>
        
    }
}

export default Login;