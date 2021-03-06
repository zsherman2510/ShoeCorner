import React, { Component } from 'react';
// prettier-ignore
import { Container, Box, Heading, Card, Image, Text, SearchField, Icon} from 'gestalt'
import { Link } from 'react-router-dom';
import Loader from './Loader';
import './App.css';
import Strapi from 'strapi-sdk-javascript/build/main';
const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class App extends Component {
	constructor() {
		super();
		this.state = {
			brands: [],
			searchTerm: '',
			loadingBrands: true
		};
	}

	async componentDidMount() {
		try {
			const response = await strapi.request('POST', '/graphql', {
				data: {
					query: `query{
          brands{
            _id
            name
            description
            image{
              url
            }
          }
        }`
				}
			});
			this.setState({ brands: response.data.brands, loadingBrands: false });
		} catch (err) {
			console.error(err);
			this.setState({ loadingBrands: false });
		}
	}

	handleChange = ({ value }) => {
		this.setState({ searchTerm: value });
	};

	filteredBrands = ({ searchTerm, brands }) => {
		return brands.filter((brand) => {
			return (
				brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				brand.description.toLowerCase().includes(searchTerm.toLowerCase())
			);
		});
	};
	render() {
		const { searchTerm, loadingBrands } = this.state;

		return (
			<Container>
				{/* Brands Search Field */}
				<Box display="flex" justifyContent="center" marginTop={2} padding={2}>
					<SearchField
						id="searchField"
						accessibilityLabel="Brands Search Field"
						onChange={this.handleChange}
						value={searchTerm}
						placeholder="Search Brands"
					/>
					<Box margin={3}>
						<Icon
							icon="filter"
							color={searchTerm ? 'green' : 'gray'}
							size={20}
							accessibilityLabel="Filter"
						/>
					</Box>
				</Box>
				{/* Brands section */}
				<Box display="flex" justifyContent="center" marginBottom={2}>
					{/* Brands Header */}
					<Heading color="maroon" size="md">
						ShoeCorner
					</Heading>
				</Box>
				{/* Brands */}
				<Box
					dangerouslySetInlineStyle={{
						__style: {
							backgroundColor: '#eee'
						}
					}}
					shape="rounded"
					wrap
					display="flex"
					justifyContent="around"
				>
					{this.filteredBrands(this.state).map((brand) => (
						<Box paddingY={4} key={brand._id}>
							<Card
								image={
									<Box height={200} width={200}>
										<Image
											fit="cover"
											alt="brand"
											naturalHeight={1}
											naturalWidth={1}
											src={`${apiUrl}${brand.image.url}`}
										/>
									</Box>
								}
							>
								<Box display="flex" alignItems="center" justifyContent="center" direction="column">
									<Text bold size="xl">
										{brand.name}
									</Text>
									<Text size="xl">{brand.description}</Text>
									<Text size="xl">
										<Link to={`/${brand._id}`}>Products</Link>
									</Text>
								</Box>
							</Card>
						</Box>
					))}
				</Box>
				{/* <Spinner show={loadingBrands} accessibilityLabel="Loading Spinner" />  */}
				{<Loader show={loadingBrands} />}
			</Container>
		);
	}
}

export default App;
