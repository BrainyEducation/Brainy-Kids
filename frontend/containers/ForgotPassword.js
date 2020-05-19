import React, { Component } from 'react';

import { Row, Col, Card, Input, Icon, Button, notification } from 'antd';

import { Link, withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import actions from '../actions';
import { bindActionCreators } from 'redux';

class ForgotPassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			buttonDisabled: true,
			loading: false,
			email: '',
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.onFieldChange = this.onFieldChange.bind(this);
	}
	componentWillMount() {
		const { teacher, token } = this.props;

		// If this user is already logged in with good credentials, they may
		// have manually navigated to this page.
		if (teacher && token) {
			this.props.history.replace('/dashboard');
		}
	}

	onFieldChange(name, e) {
		console.log(e.target.value);
		this.setState({ [name]: e.target.value }, () => {
			this.calculateButtonStatus();
		});
	}

	calculateButtonStatus() {
		const { email } = this.state;
		if (!email ) {
			return this.setState({ buttonDisabled: true });
		}

		return this.setState({ buttonDisabled: false });
	}

	invalidUsernamePasswordAlert(description) {
		notification['error']({
			message: 'An error occurred!',
			description,
		});
	}

	validUsernamePasswordAlert(description) {
		notification['success']({
			message: 'Success!',
			description,
		});
	}

	onSubmit() {
		const { email } = this.state;
		const { login } = this.props;
		if (
			email.length === 0
		) {
			this.invalidUsernamePasswordAlert(
				`You're missing a required field.`
			);
			this.setState({ loading: false, buttonDisabled: true });
			return;
		}

		this.setState({ loading: true });

		fetch(`/api/session/forgotpassword`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
			}),
		})
			.then(res => res.json())
			.then(json => {
				if (json.status !== 'ok') {
					this.setState({
						loading: false,
					});
					this.invalidUsernamePasswordAlert(json.message);
				} else {
					this.validUsernamePasswordAlert(
						"Success! Check your email for further instructions."
					);
					
					setTimeout(() => {
						this.props.history.replace('/');
					}, 1000);
				}
			})
			.catch(err => {
				console.error(err);
				this.setState({
					loading: false,
				});
				this.invalidUsernamePasswordAlert(
					'An internal server error has occurred.'
				);
			});
	}

	render() {
		const {
			email,
			loading,
			buttonDisabled,
		} = this.state;

		return (
			<Row type="flex" justify="center" style={{ marginTop: 50 }}>
				<Col xs={24} sm={24} md={12} lg={8}>
					<div style={{ marginBottom: 40 }}>
						<h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>
							Brainy Kids
						</h1>
						<h3 style={{ textAlign: 'center' }}>Teacher Portal</h3>
					</div>
					<Card title="Enter your email below to send a password reset email.">
						<div style={{ textAlign: 'right' }}>
							<Input
								placeholder="Email"
								prefix={
									<Icon
										type="mail"
										style={{ color: 'rgba(0,0,0,.25)' }}
									/>
								}
								disabled={loading}
								value={email}
								type="email"
								style={{ marginTop: 20 }}
								onChange={e => this.onFieldChange('email', e)}
								onPressEnter={this.onSubmit}
							/>
							<Button
								style={{
									textAlign: 'center',
									marginTop: 20,
								}}
								loading={loading}
								disabled={loading || buttonDisabled}
								onClick={this.onSubmit}
								type="primary">
								Send Email
							</Button>
						</div>
					</Card>
					<div style={{ paddingTop: 20 }}>
						<Link to="/">
							<Card>
								<h4
									style={{
										margin: 0,
										color: '#40a9ff',
										textAlign: 'right',
									}}>
									Already have an account?
									<Icon type="caret-right" />
								</h4>
							</Card>
						</Link>
					</div>
				</Col>
			</Row>
		);
	}
	
}

const mapStateToProps = state => {
	return {
		token: state.teacher.token,
		teacher: state.teacher.data,
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ ...actions.teacher }, dispatch);
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(ForgotPassword)
);
