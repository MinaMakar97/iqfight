import React from "react";
class Login extends React.Component{
    render(){
       return <div>
           
            <form>
                <div className="form-group">
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"></input>
                </div>
                <div class="form-group">
                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"></input>
                </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
        
    }
}

export default Login;