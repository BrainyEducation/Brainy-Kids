import React, { Component } from 'react';

import { Row, Col, Card, Input, Icon, Button, notification, Alert } from 'antd';

import { Link, withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import actions from '../actions';
import { bindActionCreators } from 'redux';

class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			buttonDisabled: true,
			loading: false,
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
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
		const { email, password, confirmPassword, name } = this.state;
		if (!email || !password || !confirmPassword || !name) {
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

	onSubmit() {
		const { name, email, password, confirmPassword } = this.state;
		const { login } = this.props;
		if (
			name.length === 0 ||
			email.length === 0 ||
			password.length === 0 ||
			confirmPassword.length === 0
		) {
			this.invalidUsernamePasswordAlert(
				`You're missing a required field.`
			);
			this.setState({ loading: false, buttonDisabled: true });
			return;
		}

		if (password.length <= 7) {
			this.invalidUsernamePasswordAlert(
				`Your password must be longer than 7 characters`
			);
			this.setState({ loading: false, buttonDisabled: true });
			return;
		}

		if (password !== confirmPassword) {
			this.invalidUsernamePasswordAlert(`Your passwords do not match`);
			this.setState({ loading: false, buttonDisabled: true });
			return;
		}

		this.setState({ loading: true });

		fetch(`/api/session/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				email,
				confirmPassword,
				password,
			}),
		})
			.then(res => res.json())
			.then(json => {
				if (json.status !== 'ok') {
					this.setState({
						loading: false,
						password: '',
						confirmPassword: '',
					});
					this.invalidUsernamePasswordAlert(json.message);
				} else {
					login(json.token, json.teacher);
					setTimeout(() => {
						this.props.history.replace('/dashboard');
					}, 200);
				}
			})
			.catch(err => {
				console.error(err);
				this.setState({
					loading: false,
					password: '',
					confirmPassword: '',
				});
				this.invalidUsernamePasswordAlert(
					'An internal server error has occurred.'
				);
			});
	}

	render() {
		const {
			name,
			email,
			password,
			confirmPassword,
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
					<Card title="Create Your Teacher Account">
						<Alert
							showIcon
							type="info"
							message={`When you first access the Data Analytics Platform (DAP) the system will automatically create for you a random 3-letter ID/password.  You should then change that to a 3-letter (and/or number) ID of your choice.  If you select an ID which someone is already using, you will be prompted to choose a different ID.`}
						/>
						<div style={{ textAlign: 'right' }}>
							<Input
								placeholder="Name"
								prefix={
									<Icon
										type="user"
										style={{ color: 'rgba(0,0,0,.25)' }}
									/>
								}
								disabled={loading}
								value={name}
								type="text"
								autoFocus
								style={{ marginTop: 20 }}
								onChange={e => this.onFieldChange('name', e)}
								onPressEnter={this.onSubmit}
							/>
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
							<Input
								placeholder="Password"
								prefix={
									<Icon
										type="key"
										style={{ color: 'rgba(0,0,0,.25)' }}
									/>
								}
								disabled={loading}
								value={password}
								type="password"
								style={{ marginTop: 20 }}
								onPressEnter={this.onSubmit}
								onChange={e =>
									this.onFieldChange('password', e)
								}
							/>
							<Input
								placeholder="Confirm Password"
								prefix={
									<Icon
										type="key"
										style={{ color: 'rgba(0,0,0,.25)' }}
									/>
								}
								disabled={loading}
								value={confirmPassword}
								type="password"
								style={{ marginTop: 20 }}
								onPressEnter={this.onSubmit}
								onChange={e =>
									this.onFieldChange('confirmPassword', e)
								}
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
								Create Your Account
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
	)(Register)
);
