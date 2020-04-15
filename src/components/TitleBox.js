import React from "react";
import "./TitleBox.css"

class TitleBox extends React.Component{
    render(){
        return <div className="title">
            {this.props.titolo}
        </div>
    }
}

export default TitleBox;