import React from "react";
import "./TitleBox.css"

class TitleBox extends React.Component{
    render(){
        const className = "title-box " + this.props.className;
        return <div className={className }>
            {this.props.titolo}
        </div>
    }
}

export default TitleBox;