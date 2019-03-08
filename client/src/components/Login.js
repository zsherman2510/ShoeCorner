import React, { Component } from 'react';
import { Container, Box, Button, Heading, TextField } from 'gestalt';
import { setToken } from './utils';
import ToastMessage from './ToastMessage';
import Strapi from 'strapi-sdk-javascript/build/main';
const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

export default class Login extends Component {
	state = {
		username: '',
		password: '',
		toast: false,
		toastMessage: '',
		loading: false
	};

	handleChange = ({ event, value }) => {
		event.persist();
		this.setState({ [event.target.name]: value });
	};

	handleSubmit = async (event) => {
		event.preventDefault();
		const { username, password } = this.state;

		if (this.isFormEmpty(this.state)) {
			this.showToast('Fill in all fields');
			return;
		}
		//Sign up User
		try {
			this.setState({ loading: true });
			const response = await strapi.register(username, password);
			this.setState({ loading: false });
			setToken(response.jwt);

			this.redirectUser('/');
			// set loading - true
			// make request to register user with strapi
			// set loading false
			// put token (to manage user session) in local storage
			// redirect user to homepage
		} catch (err) {
			this.setState({ loading: false });
			this.showToast(err.message);
			//set loading - false
			// show error message with toast message
		}
	};

	redirectUser = (path) => this.props.history.push(path);

	isFormEmpty = ({ username, password }) => {
		return !username || !password;
	};

	showToast = (toastMessage) => {
		this.setState({ toast: true, toastMessage });
		setTimeout(() => this.setState({ toast: false, toastMessage: '' }), 4000);
	};

	render() {
		const { toastMessage, toast, loading } = this.state;
		return (
			<Container display="flex" justifyContent="center" alignItems="center">
				<Box
					dangerouslySetInlineStyle={{
						__style: {
							backgroundColor: '#ddd'
						}
					}}
					margin={4}
					padding={4}
					shape="rounded"
					display="flex"
					justifyContent="center"
				>
					{/* Sign In Form */}
					<form
						style={{
							display: 'inlineBlock',
							textAlign: 'center',
							maxWidth: 450
						}}
						onSubmit={this.handleSubmit}
					>
						{/* Sign In form heading */}
						<Box
							marginBottom={2}
							display="flex"
							direction="column"
							alignItems="center"
							justifyContent="center"
						>
							<Heading>Welcome Back!</Heading>
						</Box>
						{/* User Input */}
						<TextField
							id="username"
							type="text"
							name="username"
							placeholder="Username"
							onChange={this.handleChange}
						/>
						{/* Password Input */}
						<TextField
							id="password"
							type="password"
							name="password"
							placeholder="Password"
							onChange={this.handleChange}
						/>
						<Button inline disabled={loading} color="red" margin={10} text="Submit" type="submit" />
					</form>
				</Box>
				<ToastMessage show={toast} message={toastMessage} />
			</Container>
		);
	}
}
