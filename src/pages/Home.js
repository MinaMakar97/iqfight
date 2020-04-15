
import React from "react";
import Login from "../components/Login.js";

import TitleBox from "../components/TitleBox.js"
class Home extends React.Component{
    render(){
        return <div>
            <TitleBox titlo="Login"></TitleBox>
            
            <Login>

            </Login>
        </div>
    }
    
}
export default Home;