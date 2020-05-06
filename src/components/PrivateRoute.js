import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

export default class PrivateRoute extends Component {
	constructor(props) {
		super(props);
		this.isAuth = this.isAuth.bind(this);
	}

	isAuth() {
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = (e) => {
			if (e.target.readyState === 4 && e.target.status === 200) {
				let json = JSON.parse(e.target.responseText);
				return json["loggato"];
			}
		};
		xhr.open("GET", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/login.php", true);
		xhr.withCredentials = true;
		xhr.send();
	}

	render() {
		return (
			<Route
				{...this.props}
				render={({ location }) =>
					this.isAuth() ? (
						this.children
					) : (
						<Redirect
							to={{
								pathname: "/login",
								state: { from: location },
							}}
						/>
					)
				}
			/>
		);
	}
}
