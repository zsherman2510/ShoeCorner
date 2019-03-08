import React, { Component } from 'react';
import { Box, Text, Heading, Button } from 'gestalt';
import { getToken, clearToken, clearCart } from './utils';
import { NavLink, withRouter } from 'react-router-dom';

class NavBar extends Component {
	handleSignOut = () => {
		clearToken();
		clearCart();
		this.props.history.push('/');

		// clear token
		// clear cart
		// redirect home
	};

	render() {
		return getToken() !== null ? <AuthNav handleSignOut={this.handleSignOut} /> : <UnAuthNav />;
	}
}

const AuthNav = ({ handleSignOut }) => (
	<Box
		display="flex"
		alignItems="center"
		justifyContent="around"
		height={70}
		color="lightWash"
		padding={1}
		shape="roundedBottom"
	>
		{/* Title and Logo */}
		{/*checkout Link */}
		<NavLink activeClassName="active" to="/checkout">
			<Button
				dangerouslySetInlineStyle={{
					__style: {
						backgroundColor: '#66CD00',
						color: '#fff'
					}
				}}
				text="Checkout"
				inline
				size="md"
			/>
		</NavLink>
		<NavLink activeClassName="active" exact to="/">
			<Heading size="xs">ShoeCorner</Heading>
		</NavLink>
		{/*Signout Button */}
		<Button onClick={handleSignOut} color="transparent" text="Sign Out" inline size="md" />
	</Box>
);

const UnAuthNav = () => (
	<Box
		display="flex"
		alignItems="center"
		justifyContent="around"
		height={70}
		color="lightWash"
		padding={1}
		shape="roundedBottom"
	>
		{/* Title and Logo */}
		<NavLink activeClassName="active" exact to="/">
			<Heading size="xs">ShoeCorner</Heading>
		</NavLink>

		<Box display="flex" justifyContent="between">
			{/*Sign in Link */}
			<NavLink activeClassName="active" to="/login">
				<Text size="lg">Login</Text>
			</NavLink>

			{/*Sign up Link */}
			<NavLink activeClassName="active" to="/signup">
				<Text size="lg">/Sign up</Text>
			</NavLink>
		</Box>
	</Box>
);

export default withRouter(NavBar);
