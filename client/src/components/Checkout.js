import React, { Component } from 'react';
// prettier-ignore
import { Container, Box, Heading, TextField, Text, Modal, Spinner, Button } from 'gestalt';
import { Elements, StripeProvider, CardElement, injectStripe } from 'react-stripe-elements';
import ToastMessage from './ToastMessage';
import { getCart, calculatePrice, clearCart, calculateAmount } from './utils';
import { withRouter } from 'react-router-dom';
import Strapi from 'strapi-sdk-javascript/build/main';
import { publicKey } from './utils/Keys';
const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class _CheckoutForm extends Component {
	state = {
		cartItems: [],
		address: '',
		postalCode: '',
		city: '',
		confirmationEmailAddress: '',
		toast: false,
		toastMessage: '',
		orderProcessing: false,
		modal: false
	};

	componentDidMount() {
		this.setState({ cartItems: getCart() });
	}

	handleChange = ({ event, value }) => {
		event.persist();
		this.setState({ [event.target.name]: value });
	};

	handleConfirmOrder = async (event) => {
		event.preventDefault();

		if (this.isFormEmpty(this.state)) {
			this.showToast('Fill in all fields');
			return;
		}
		this.setState({ modal: true });
	};

	handleSubmitOrder = async () => {
		const { cartItems, city, address, postalCode } = this.state;
		const amount = calculateAmount(cartItems);

		//process order
		this.setState({ orderProcessing: true });
		let token;
		try {
			const response = await this.props.stripe.createToken();
			token = response.token.id;
			await strapi.createEntry('orders', {
				amount,
				shoes: cartItems,
				city,
				postalCode,
				address,
				token
			});
			this.setState({ orderProcessing: false, modal: false });
			clearCart();
			this.showToast('Your order has been successfully submitted!', true);
			//create stripe token
			//create order with strapi sdk(make request to backend)
			// set orderProcessing - false, set modal - false
			//clear user cart of shoes
			// show success toast
		} catch (err) {
			this.setState({ orderProcessing: false, modal: false });
			this.showToast(err.message);
			// set order processing -false , modal- false
			// show error toast
		}
	};

	isFormEmpty = ({ address, postalCode, city, confirmationEmailAddress }) => {
		return !address || !postalCode || !city || !confirmationEmailAddress;
	};

	showToast = (toastMessage, redirect = false) => {
		this.setState({ toast: true, toastMessage });
		setTimeout(
			() =>
				this.setState(
					{ toast: false, toastMessage: '' },
					// if true passed to 'redirect' back home
					() => redirect && this.props.history.push('/')
				),
			4000
		);
	};

	closeModal = () => this.setState({ modal: false });

	render() {
		// prettier-ignore
		const { toast, toastMessage, cartItems, modal, orderProcessing } = this.state;
		return (
			<Container display="flex" justifyContent="center" alignItems="center">
				<Box
					color="darkWash"
					margin={4}
					padding={4}
					shape="rounded"
					display="flex"
					justifyContent="center"
					alignItems="center"
					direction="column"
				>
					{/* Checkout form heading */}
					<Heading>Checkout</Heading>
					{cartItems.length > 0 ? (
						<React.Fragment>
							<Box
								display="flex"
								justifyContent="center"
								alignItems="center"
								direction="column"
								marginTop={2}
								marginBottom={6}
							>
								<Text color="darkGray" italic>
									{cartItems.length} Items for Checkout
								</Text>
								<Box padding={2}>
									{cartItems.map((item) => (
										<Box key={item._id} padding={1}>
											<Text color="midnight">
												{item.name} x {item.quantity} - ${item.quantity * item.Price}
											</Text>
										</Box>
									))}
								</Box>
								<Text bold>Total Amount: {calculatePrice(cartItems)}</Text>
							</Box>
							{/* Checkout Form */}
							<form
								style={{
									display: 'inlineBlock',
									textAlign: 'center',
									maxWidth: 450
								}}
								onSubmit={this.handleConfirmOrder}
							>
								{/* Shipping Address Input */}
								<TextField
									id="address"
									type="text"
									name="address"
									placeholder="Shipping Address"
									onChange={this.handleChange}
								/>
								{/* Postal Code Input */}
								<TextField
									id="postalCode"
									type="text"
									name="postalCode"
									placeholder="Postal Code"
									onChange={this.handleChange}
								/>

								{/* City Input */}
								<TextField
									id="city"
									type="text"
									name="city"
									placeholder="City of Residence"
									onChange={this.handleChange}
								/>
								{/* Confirmation Email Address */}
								<TextField
									id="confirmationEmailAddress"
									type="email"
									name="confirmationEmailAddress"
									placeholder="Confirmation Email Address"
									onChange={this.handleChange}
								/>
								{/* Card element */}

								<CardElement id="stripe__input" onReady={(input) => input.focus()} />
								<button id="stripe__button" type="submit">
									Submit
								</button>
							</form>
						</React.Fragment>
					) : (
						// Default text if no items in cart
						<Box color="darkWash" shape="rounded" padding={4}>
							<Heading align="center" color="watermelon" size="xs">
								Your cart is Empty
							</Heading>
							<Text align="center" italic color="green">
								Add some Kicks
							</Text>
						</Box>
					)}
				</Box>
				{/* Confirmation modal */}
				{modal && (
					<ConfirmationModal
						orderProcessing={orderProcessing}
						cartItems={cartItems}
						closeModal={this.closeModal}
						handleSubmitOrder={this.handleSubmitOrder}
					/>
				)}
				<ToastMessage show={toast} message={toastMessage} />
			</Container>
		);
	}
}

const ConfirmationModal = ({ orderProcessing, cartItems, closeModal, handleSubmitOrder }) => (
	<Modal
		accessibilityCloseLabel="close"
		accessibilityModalLabel="Confirm Your Order"
		heading="Confirm your order"
		onDismiss={closeModal}
		footer={
			<Box display="flex" marginRight={-1} marginLeft={-1} justifyContent="center">
				<Box padding={1}>
					<Button
						size="lg"
						color="blue"
						text="Submit"
						disabled={orderProcessing}
						onClick={handleSubmitOrder}
					/>
				</Box>
				<Box padding={1}>
					<Button size="lg" text="Cancel" disabled={orderProcessing} onClick={closeModal} />
				</Box>
			</Box>
		}
		role="alertdialog"
		size="sm"
	>
		{/* Order Summary */}
		{!orderProcessing && (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				direction="column"
				padding={2}
				color="lightWash"
			>
				{cartItems.map((item) => (
					<Box key={item._id} padding={1}>
						<Text size="lg" color="pine">
							{item.name} x {item.quantity} -${item.quantity * item.Price}
						</Text>
					</Box>
				))}
				<Box paddingY={2}>
					<Text size="lg" bold>
						Total: {calculatePrice(cartItems)}
					</Text>
				</Box>
			</Box>
		)}

		{/* Order Processing Spinner */}
		<Spinner show={orderProcessing} accessibilityLabel="Order Processing Spinner" />
		{orderProcessing && (
			<Text align="center" italic>
				Submitting Order...{' '}
			</Text>
		)}
	</Modal>
);

const CheckoutForm = withRouter(injectStripe(_CheckoutForm));

const Checkout = () => (
	<StripeProvider apiKey={publicKey}>
		<Elements>
			<CheckoutForm />
		</Elements>
	</StripeProvider>
);

export default Checkout;
