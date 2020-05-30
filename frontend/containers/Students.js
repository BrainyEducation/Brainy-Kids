import React, { Component } from 'react';
import {
	Button,
	Modal,
	Row,
	Col,
	Card,
	List,
	Popover,
	Upload,
	notification,
	Icon,
	message,
} from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CSVLink, CSVDownload } from 'react-csv';

import PageFormat from '../components/PageFormat';
import NewStudentModal from '../components/NewStudentModal';

import actions from '../actions';

const PopoverComponent = () => {
	return (
		<Popover
			style={{ display: 'inline-block' }}
			content={
				<p style={{ maxWidth: 400 }}>
					To ensure student privacy, we ask you only use first names or first name + last name initial.<br />
				</p>
			}
			title="Student names?">
			<Icon
				type="info-circle"
				style={{ marginLeft: 10, position: 'relative', top: -5 }}
			/>
		</Popover>
	);
};

class Students extends Component {
	constructor(props) {
		super(props);

		this.state = {
			modalVisibility: false,
			createStudentLoading: false,
			student_id: '',
			studentNamesHidden: false,
		};
		
		this.createStudent = this.createStudent.bind(this);
		this.newStudentOnChangeId = this.newStudentOnChangeId.bind(this);
		this.newStudentOnChangeName = this.newStudentOnChangeName.bind(this);
		this.setModalVisibility = this.setModalVisibility.bind(this);
		this.hideStudentNames = this.hideStudentNames.bind(this);
	}

	studentReference(student) {
		if(this.state.studentNamesHidden) return `<Name Hidden>  –– ID: ${ student.student_id}`;
		return (
			student.student_name === null || 
		!('student_name' in student)
			? '<Name not set>'
			:  student.student_name) + ` –– ID: ${ student.student_id}`;
	}

	createStudent() {
		const { token, students } = this.props;
		const { student_id } = this.state;
		const { student_name } = this.state;
		if (!student_id || student_id.length !== 2) {
			return notification.error({
				message: 'Uh oh!',
				description: 'Please enter a 2-digit student ID number',
			});
		}

		const alreadyUsedCheck = students.find(s => {
			return s.student_id === student_id;
		});

		if (alreadyUsedCheck) {
			return notification.error({
				message: 'Uh oh!',
				description: 'That student ID is already in use.',
			});
		}

		this.setState({ createStudentLoading: true });

		fetch(`/api/student`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				teacher: this.props.teacher._id,
				student_id,
				student_name,
			}),
		})
			.then(res => res.json())
			.then(json => {
				this.setState({ createStudentLoading: false });
				if (json.status === 'ok') {
					this.props.appendStudent(json.student);
					notification.success({
						message: 'Success!',
						description:
							'That student has been created successfully!',
					});
					this.setModalVisibility(false);
				} else {
					notification.error({
						message: 'Uh oh!',
						description:
							json.errors && json.errors.length > 0
								? json.errors[0].msg
								: json.message ||
								  'An unexpected system error has occurred.',
					});
				}
			})
			.catch(err => {
				console.error(err);
				this.setState({ createStudentLoading: true });
				notification.error({
					message: 'System error',
					description:
						"Uh oh! An unexpected system error has occurred. We're sorry!",
				});
			});
	}

	componentWillMount() {
		const { students, loadStudents } = this.props;
		if (!students) {
			loadStudents();
		}
	}

	setModalVisibility(value) {
		this.setState({ modalVisibility: value, student_id: '' });
	}

	hideStudentNames(){
		this.setState({ studentNamesHidden: !this.state.studentNamesHidden });
	}

	newStudentOnChangeId(e) {
		const student_id = e.target.value;
		this.setState({student_id});
	}
	newStudentOnChangeName(e) {
		const student_name = e.target.value;
		this.setState({student_name});
	}

	render() {
		const { teacher, students, loading, error } = this.props;

		const { createStudentLoading, csv } = this.state;

		return (
			<PageFormat
				page="students"
				loading={loading}
				popover={<PopoverComponent />}
				extra={
					<div>
						<Button
							style={{
								margin: 5,
							}}
							type="danger"
							onClick={() => this.hideStudentNames() }>
							{ this.state.studentNamesHidden ? 'Show' : 'Hide' } Student Names
						</Button>
						<Button
							style={{
								margin: 5,
							}}
							type="primary"
							onClick={() => this.setModalVisibility(true)}>
							New Student
						</Button>
					</div>
				}>
				<NewStudentModal
					visible={this.state.modalVisibility}
					loading={createStudentLoading}
					onOk={this.createStudent}
					onCancel={() => this.setModalVisibility(false)}
					onChangeId={this.newStudentOnChangeId}
					onChangeName={this.newStudentOnChangeName}
				/>
				{!students || students.length === 0 ? (
					<p>You have no students in your classes yet.</p>
				) : (
					<List
						size="small"
						itemLayout="horizontal"
						dataSource={students}
						renderItem={student => (
							<Link to={`/student/${student._id}`}>
								<List.Item
									actions={[<Button>View Student</Button>]}>
									<List.Item.Meta
										style={{ margin: 0}}
										title={
											<span>
												{this.studentReference(student)}
											</span>
										}
									/>
								</List.Item>
							</Link>
						)}
					/>
				)}
			</PageFormat>
		);
	}
}

const mapStateToProps = state => {
	return {
		teacher: state.teacher.data,
		students: state.students.data,
		loading: state.students.loading,
		error: state.students.error,
		token: state.teacher.token,
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ ...actions.students }, dispatch);
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Students)
);
