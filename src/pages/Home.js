import React from "react";
import Login from "../components/Login.js";
import FormRegistrazione from "../components/FormRegistrazione.js"
import "./Home.css"
import logo from "../img/iqfight-logo.png";
import { Switch, Route } from "react-router-dom";



class Home extends React.Component{
    render(){
        return <div className="row w-100 contenuto"> 
              
            <div className="col-12 col-sm-5 div-logo">
                <img src={logo} width="70%" alt="logo"/>
                <p className="descrizione mt-sm-5">Sfida i tuoi amici in una competizione su chi ne sa di più!</p>
                
            </div>
            <div className= "col-12 col-sm-1 riga contenuto"> <hr className="riga"></hr></div>
            <div className="col-12 col-sm-6">
            <Switch>
                <Route path="/login" component={Login}></Route>
                <Route path="/registrazione" component={FormRegistrazione}></Route>
			</Switch>
            </div> 
        </div>
    }
    
}
export default Home;