import React, { Component } from 'react';
import Strapi from 'strapi-sdk-javascript/build/main';
import { Box, Heading, Text, Image, Card, Button, Mask, IconButton } from 'gestalt';
import { Link } from 'react-router-dom';
import { calculatePrice, setCart, getCart } from './utils';
const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

export default class Shoes extends Component {
	state = {
		shoes: [],
		brand: '',
		cartItems: []
	};
	async componentDidMount() {
		try {
			const response = await strapi.request('POST', '/graphql', {
				data: {
					query: `query {
                    brand(id:"${this.props.match.params.brandId}") {
                        _id
                        name
                        shoes{
                        _id
                        name
                        description
                        image {
                            url
                        }
                        Price
                        }
                        }
                    }`
				}
			});
			this.setState({
				shoes: response.data.brand.shoes,
				brand: response.data.brand.name,
				cartItems: getCart()
			});
		} catch (err) {
			console.error(err);
		}
	}

	addToCart = (shoe) => {
		const alreadyInCart = this.state.cartItems.findIndex((item) => item._id === shoe._id);

		if (alreadyInCart === -1) {
			const updatedItems = this.state.cartItems.concat({
				...shoe,
				quantity: 1
			});
			this.setState({ cartItems: updatedItems }, () => setCart(updatedItems));
		} else {
			const updatedItems = [ ...this.state.cartItems ];
			updatedItems[alreadyInCart].quantity += 1;
			this.setState({ cartItems: updatedItems }, () => setCart(updatedItems));
		}
	};

	deleteItemFromCart = (itemToDeleteId) => {
		const filteredItems = this.state.cartItems.filter((item) => item._id !== itemToDeleteId);
		this.setState({ cartItems: filteredItems }, () => setCart(filteredItems));
	};
	render() {
		const { brand, shoes, cartItems } = this.state;
		return (
			<Box
				marginTop={4}
				display="flex"
				justifyContent="center"
				alignItems="start"
				dangerouslySetInlineStyle={{
					__style: {
						flexWrap: 'wrap-reverse'
					}
				}}
			>
				{/* Shoes Section */}
				<Box display="flex" direction="column" alignItems="center">
					<Box margin={2}>
						<Heading color="orchid">{brand}</Heading>
					</Box>
					{/* Shoes */}
					<Box
						dangerouslySetInlineStyle={{
							__style: {
								backgroundColor: '#eee'
							}
						}}
						wrap
						shape="rounded"
						display="flex"
						justifyContent="center"
						padding={4}
					>
						{shoes.map((shoe) => (
							<Box paddingY={4} margin={4} width={200} key={shoe._id}>
								<Card
									image={
										<Box height={200} width={200}>
											<Image
												fit="cover"
												position="center"
												alt="brand"
												naturalHeight={1}
												naturalWidth={1}
												src={`${apiUrl}${shoe.image.url}`}
											/>
										</Box>
									}
								>
									<Box display="flex" alignItems="center" justifyContent="center" direction="column">
										<Box marginBottom={3}>
											<Text bold size="xl">
												{shoe.name}
											</Text>
										</Box>
										<Text>{shoe.description}</Text>
										<Text color="orchid">${shoe.Price}</Text>
										<Box marginTop={2}>
											<Text size="xl">
												<Button
													onClick={() => this.addToCart(shoe)}
													color="red"
													text="Add to cart"
												/>
											</Text>
										</Box>
									</Box>
								</Card>
							</Box>
						))}
					</Box>
				</Box>
				{/* User Cart */}
				<Box alignSelf="end" marginTop={2} marginLeft={8}>
					<Mask shape="rounded" wash>
						<Box display="flex" direction="column" alignItems="center" padding={2}>
							{/* User cart heading */}
							<Heading align="center" size="xs">
								Your cart
							</Heading>
							<Text color="gray" italic>
								{cartItems.length} items selected
							</Text>
							{/* Cart Items */}
							{cartItems.map((item) => (
								<Box key={item._id} display="flex" alignItems="center">
									<Text>
										{item.name} x {item.quantity} -{(item.quantity * item.Price).toFixed(2)}
									</Text>
									<IconButton
										accessibilityLabel="Delete item"
										icon="cancel"
										size="sm"
										iconColor="red"
										onClick={() => this.deleteItemFromCart(item._id)}
									/>
								</Box>
							))}

							<Box display="flex" alignItems="center" justifyContent="center" direction="column">
								<Box margin={2}>
									{cartItems.length === 0 && <Text color="red">Please select some items</Text>}
								</Box>
								<Text size="lg">Total : {calculatePrice(cartItems)}</Text>
								<Text>
									<Link to="/checkout">Checkout</Link>
								</Text>
							</Box>
						</Box>
					</Mask>
				</Box>
			</Box>
		);
	}
}
