import React, { Component } from 'react';
import {
	Row,
	Col,
	Card,
	List,
	Icon,
	Divider,
	Progress,
	Button,
	message,
	notification,
} from 'antd';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PageFormat from '../components/PageFormat';

import { Link, withRouter } from 'react-router-dom';
import NotFound from './NotFound';

import moment from 'moment';

import actions from '../actions';
import util from '../helpers/util';

import AnalyticRow from '../components/AnalyticRow';

const DeleteButton = props => {
	return (
		<Button
			onClick={props.onClick}
			loading={props.loading}
			type={props.loading ? 'dashed' : 'danger'}>
			{!props.loading && <Icon type="delete" />}
		</Button>
	);
};

const NoAnalytics = () => {
	return (
		<div>
			<Divider />
			<Row>
				<p style={{ textAlign: 'center' }}>
					Student has not completed any focus items yet
				</p>
			</Row>
		</div>
	);
};

const AnalyticsRows = ({ analytics }) => {
	const lastEvent = analytics[0].createdAt;
	return (
		<Row>
			<p>
				<b>Last Activity Date:</b> {moment(lastEvent).format('llll')}
			</p>
			<Divider />
			<h2>Recently Completed</h2>
			{analytics.map((a, i) => (
				<AnalyticRow key={i} analytic={a} program={a.program} />
			))}
		</Row>
	);
};

class StudentShow extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			analytics: null,
		};
		this.deleteStudent = this.deleteStudent.bind(this);
		this.getProgramName = this.getProgramName.bind(this);
	}

	deleteStudent(id) {
		this.props.deleteStudent(id);
	}

	getProgramName(id){
		const { programs } = this.props;
		if (programs === undefined || !programs) {
			return id;
		} else {
			const p = programs.find(p => p._id === id);
			if(p === undefined || !p) {
				return 'UNKNOWN PROJECT';
			} else {
				return p.name;
			}
		}
	}

	componentWillMount() {
		const { programs, students, match, token } = this.props;
		const { analytics } = this.state;
		
		if (!programs) {
			this.setState({ loading: true });
			this.props.loadPrograms();
		}

		if (!students || students.length === 0) {
			this.setState({ loading: true });
			this.props.loadStudents();
		}

		if (analytics === null) {
			this.setState({ loading: true });
			fetch(`/api/analytics/mostRecent`, {
				method: 'POST',
				headers: util.generateAPIHeadersWithToken(token),
				body: JSON.stringify({
					student: match.params.id,
				}),
			})
				.then(res => res.json())
				.then(json => {
					this.setState({ loading: false });
					if (json.status !== 'ok') {
						notification.error({
							message: 'Uh oh',
							description: json.message,
						});
						return;
					} else {
						this.setState({ analytics: json.analytics });
					}
				})
				.catch(err => {
					notification.error({
						message: 'Uh oh',
						description: 'An unexpected server error has occurred',
					});
				});
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.students !== this.props.students) {
			this.setState({ loading: false });

			const { students, match } = this.props;
			const studentObjectIdParam = match.params.id;

			const student = students.find(s => s._id === studentObjectIdParam);
			if (student === null) {
				this.props.history.push('/students');
			}
		}
	}

	render() {
		const {loading, programs, students, match } = this.props;
		const { analytics } = this.state;
		const studentObjectIdParam = match.params.id;

		const student = students.find(s => s._id === studentObjectIdParam);
		
		if (!student && !loading) {
			message.success('Student has been successfully deleted');
			this.props.history.push('/students');
			return <div />;
		}
		
		const studentName = student
			? student.student_name
				? student.student_name
				: student.student_id
			: 'Student Detail';



		const progressBars = student.progress.map(p => {
			return (<div key={p.program_id}>
				<h4 style={{ marginTop: '0.5rem', marginBottom: 0 }}>
					{( this.getProgramName(p.program_id) )}
				</h4>				
				<Progress type="line" percent={parseInt(p.program_percentage)}/>
			</div>)
		})


		return (
			<div>
				<PageFormat
					page="students"
					title={studentName}
					extra={
						<DeleteButton
							onClick={() => this.deleteStudent(student._id)}
							loading={
								student.queuedForDeletion
									? student.queuedForDeletion
									: false
							}
						/>
					}
					loading={loading}>

					{progressBars}

					{!analytics || (analytics.length === 0 && <NoAnalytics />)}
					{analytics &&
						analytics.length > 0 && (
							<AnalyticsRows analytics={analytics} />
						)}
				</PageFormat>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		programs: state.programs.data,
		loading: state.programs.loading,
		error: state.programs.error,
		token: state.teacher.token,
		students: state.students ? state.students.data : [],
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ ...actions.students, ...actions.programs }, dispatch);
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(StudentShow)
);
