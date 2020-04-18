import React from "react";
import TitleBox from "../components/TitleBox.js";
class Login extends React.Component{
    render(){
       return <div className={this.props.className}>
            <TitleBox titolo="Login" className="shadow mt-3 mt-lg-4 form"></TitleBox>
            <form className="form">
                <input type="email" className="form-control mt-3 mt-lg-4 shadow" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"></input>
                <input type="password" className="form-control mt-3 mt-lg-4 shadow" id="exampleInputPassword1" placeholder="Password"></input>
                <button type="submit" className="mt-3 mt-lg-4 shadow bottone">Accedi</button>
                <button type="submit" className="mt-3 mt-lg-4 shadow bottone" style={{ float:"right" }}>Registrati</button>
            </form>
        </div>
        
    }
}

export default Login;