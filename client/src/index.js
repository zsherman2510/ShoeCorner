import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { getToken } from './components/utils';
import 'gestalt/dist/gestalt.css';
import App from './components/App';
import Login from './components/Login';
import Signup from './components/Signup';
import Checkout from './components/Checkout';
import Navbar from './components/Navbar';
import Shoes from './components/Shoes';
import * as serviceWorker from './serviceWorker';

const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={(props) =>
			getToken() !== null ? (
				<Component {...props} />
			) : (
				<Redirect
					to={{
						pathname: '/login',
						state: { from: props.location }
					}}
				/>
			)}
	/>
);

const Root = () => (
	<Router>
		<React.Fragment>
			<Navbar />
			<Switch>
				<Route component={App} exact path="/" />
				<Route component={Login} path="/login" />
				<Route component={Signup} path="/signup" />
				<PrivateRoute component={Checkout} path="/checkout" />
				<Route component={Shoes} path="/:brandId" />
			</Switch>
		</React.Fragment>
	</Router>
);

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
