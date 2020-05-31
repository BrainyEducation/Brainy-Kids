import React, { Component } from 'react';
import {
	Button,
	Row,
	Col,
	Card,
	Form,
	Divider,
	Input,
	notification,
	Breadcrumb
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

const FormItem = Form.Item;

import PageFormat from '../components/PageFormat';

import actions from '../actions';

const PageBreadcrumb = () => {
	return (
		<Breadcrumb>
			<Breadcrumb.Item>
				<Link to="/account">My Account</Link>
			</Breadcrumb.Item>
			<Breadcrumb.Item>
				<Link to={`/account/teacherid`}>Change Your Teacher ID</Link>
			</Breadcrumb.Item>
		</Breadcrumb>
	);
};

class ChangeTeacherId extends Component {
	constructor(props) {
		super(props);

		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(e) {
		e.preventDefault();
		const { teacher, updateTeacherInformation, form } = this.props;
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				updateTeacherInformation(
					teacher._id,
					teacher.name,
					teacher.email,
					values.teacher_id
				);
			}
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const { loading, teacher } = this.props;

		return (
			<PageFormat
				page="account"
				title="Change Your Teacher ID"
				breadcrumb={<PageBreadcrumb />}>
				<Row>
					<Col xs={24} sm={20} md={16} lg={12} xl={12}>
						<Form onSubmit={this.onSubmit} layout="vertical">
							<FormItem label="Teacher ID">
							{getFieldDecorator('teacher_id', {
									initialValue: teacher.teacher_id,
									rules: [
										{
											min: 3,
											message:
												'A minimum ID length of 3 is required',
										},											{
											max: 3,
											message:
												'A maximum ID length of 3 is required',
										},
									],
								})(
									<Input
										type="text"
										placeholder="ID Number"
										minLength="3"
										maxLength="3"
									/>
								)}
							</FormItem>
							<FormItem>
								<Button
									htmlType="submit"
									type="primary"
									loading={loading}>
									Save Changes
								</Button>
							</FormItem>
						</Form>
					</Col>
				</Row>
			</PageFormat>
		);
	}
}

const mapStateToProps = state => {
	return {
		loading: state.teacher.loading ? state.teacher.loading : false,
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
	)(Form.create()(ChangeTeacherId))
);