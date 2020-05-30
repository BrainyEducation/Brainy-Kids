import { notification } from 'antd';
import * as types from '../types';
import { generateAPIHeaders } from '../helpers/util';

module.exports.login = (token, teacher) => {
	return {
		type: types.LOGIN,
		token,
		teacher,
	};
};

module.exports.logout = () => {
	return {
		type: types.LOGOUT,
	};
};

const reloadTeacherDataLoading = () => {
	return {
		type: types.RELOAD_TEACHER_DATA_LOADING,
	};
};

const reloadTeacherDataSuccess = teacher => {
	return {
		type: types.RELOAD_TEACHER_DATA_SUCCESS,
		teacher,
	};
};

const reloadTeacherDataError = error => {
	return {
		type: types.RELOAD_TEACHER_DATA_ERROR,
		error,
	};
};

module.exports.reloadTeacherData = () => {
	return (dispatch, getState) => {
		dispatch(reloadTeacherDataLoading());
		fetch(`/api/session/info`, {
			method: 'GET',
			headers: generateAPIHeaders(getState),
		})
			.then(res => res.json())
			.then(json => {
				if (json.status !== 'ok') {
					return dispatch(reloadTeacherDataError(json.message));
				}
				return dispatch(reloadTeacherDataSuccess(json.teacher));
			})
			.catch(err => dispatch(reloadTeacherDataError(err)));
	};
};

const updateTeacherDataLoading = () => {
	return {
		type: types.UPDATE_TEACHER_DATA_LOADING,
	};
};

const updateTeacherDataSuccess = teacher => {
	return {
		type: types.UPDATE_TEACHER_DATA_SUCCESS,
		teacher,
	};
};

const updateTeacherDataError = error => {
	return {
		type: types.UPDATE_TEACHER_DATA_ERROR,
		error,
	};
};

module.exports.updateTeacherInformation = (id, name, email, teacher_id) => {
	return (dispatch, getState) => {
		dispatch(reloadTeacherDataLoading());
		fetch(`/api/teacher/${id}`, {
			method: 'PUT',
			headers: generateAPIHeaders(getState),
			body: JSON.stringify({
				name,
				email,
				teacher_id,
			}),
		})
			.then(res => res.json())
			.then(json => {
				if (json.status !== 'ok') {
					notification.error({
						message: 'Oops!',
						description:
							json.errors && json.errors.length > 0
								? json.errors[0].msg
								: json.message ||
								  'An unexpected system error has occurred. Please try again in a few moments.',
					});
				} else {
					dispatch(updateTeacherDataSuccess(json.teacher));
					notification.success({
						message: 'Account update!',
						description: `Your account has been successfully updated.`,
					});
				}
			})
			.catch(err => {
				console.error(err);
				notification.error({
					message: 'Oops!',
					description:
						err.messsage ||
						'An unexpected system error has occurred. Please try again in a few moments.',
				});
			});
	};
};
