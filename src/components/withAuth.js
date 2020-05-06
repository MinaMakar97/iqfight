import React from "react";
import { Redirect } from "react-router-dom";

const withAuth = (Component) => {
	return class App extends Component {
		constructor(props) {
			super(props);

			this.state = {
				autenticato: false,
				caricamento: true,
			};
			this.xhr = null;
		}

		componentDidMount() {
			this.xhr = new XMLHttpRequest();
			this.xhr.onreadystatechange = (e) => {
				if (e.target.readyState === 4 && e.target.status === 200) {
					let json = JSON.parse(e.target.responseText);
					this.setState({ caricamento: false, autenticato: json["loggato"] });
				}
			};
			this.xhr.open("GET", process.env.REACT_APP_LOCAL_ENDPOINT + "/iqfight/login.php");
			this.xhr.withCredentials = true;
			this.xhr.send();
		}

		componentWillUnmount() {
			this.xhr.onreadystatechange = null;
		}

		render() {
			const { autenticato, caricamento } = this.state;
			if (caricamento) return null;
			if (!caricamento && !autenticato) {
				return <Redirect to="/login" />;
			}
			return <Component {...this.props} />;
		}
	};
};

export default withAuth;
