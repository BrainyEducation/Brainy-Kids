'use strict';
const controllers = require('./controllers');

var validation = require('./helpers/validation');
// We disable sessions since we want to validate the token on each request
const PASSPORT_OPTIONS = { session: false };
const {
	body,
	check,
	oneOf,
	validationResult,
} = require('express-validator/check');

module.exports = (app, passport) => {
	/**
	 * The following code is used on routes which we wish to protect via JWTs.
	 * It only verifies that valid token is provided, for a valid teacher or
	 * student, it doesn't verify that a student can access only certain routes.
	 * Additional validation is necessary for that.
	 *
	 * Middleware: passport.authenticate('jwt', PASSPORT_OPTIONS)
	 */
	app.post(
		'/api/session/login',
		[
			check('email', 'Must contain an email.').exists(),
			check('password', 'Must contain an password.').exists(),
			check('email', 'Email field must contain a valid email.').isEmail(),
			check(
				'password',
				'Password must be at least 7 characters long'
			).isLength({ min: 8 }),
			validation.validate(validationResult),
		],
		controllers.session.login
	);

	app.post(
		'/api/session/register',
		[
			check('email', 'Must contain an email.').exists(),
			check('password', 'Must contain an password.').exists(),
			check('email', 'Email field must contain a valid email.').isEmail(),
			check(
				'password',
				'Password must be at least 7 characters long'
			).isLength({ min: 8 }),
			validation.validate(validationResult),
		],
		controllers.session.newTeacher
	);

	app.post(
		'/api/session/student',
		[
			check('id', 'Must contain an id.').exists(),
			validation.validate(validationResult),
		],
		controllers.session.loginStudent
	);

	app.post(
		'/api/session/resetpassword',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			check('password', 'Must contain an password.').exists(),
			check(
				'confirm_password',
				'Must contain an confirm password.'
			).exists(),
			check('password', 'Password must be at least 7 characters long')
				.isLength({ min: 8 })
				.custom((value, { req, loc, path }) => {
					if (value !== req.body.confirm_password) {
						// trow error if passwords do not match
						throw new Error("Passwords don't match");
					} else {
						return value;
					}
				}),
			validation.validate(validationResult),
		],
		controllers.session.resetPassword
	);

	app.post(
		'/api/session/forgotpassword',
		[
			check('email', 'Must contain an email.').exists(),
			validation.validate(validationResult),
		],
		controllers.session.forgotPasswordPost
	);

	app.get(
		'/api/session/forgotpassword',
		[
			check('tid', 'Must contain teacher id reference.').exists(),
			check('pid', 'Must contain password id reference.').exists(),
			validation.validate(validationResult),
		],
		controllers.session.forgotPasswordGet
	);

	app.get(
		'/api/session/info',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			validation.validate(validationResult),
		],
		controllers.session.getInfo
	);
	app.get(
		'/api/session/studentinfo',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			validation.validate(validationResult),
		],
		controllers.session.getStudentInfo
	);

	app.get(
		'/status',
		[validation.validate(validationResult)],
		controllers.static.status
	);

	/**
	 * Program Routes
	 */
	app.get(
		'/api/programs',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			validation.validate(validationResult),
		],
		controllers.program.getAll
	);
	app.get(
		'/api/program/:id',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			validation.validate(validationResult),
		],
		controllers.program.getOne
	);
	app.get(
		'/api/program/:id/focusitem',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			validation.validate(validationResult),
		],
		controllers.program.getFocusItemByProgram
	);
	app.post(
		'/api/program',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			check('name', 'Must contain a name.').exists(),
			check('description', 'Must contain a description.').exists(),
			check('type', 'Must contain a type.').exists(),
			validation.validate(validationResult),
		],
		controllers.program.create
	);
	app.put(
		'/api/program/:id',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			validation.validate(validationResult),
		],
		controllers.program.update
	);
	app.delete(
		'/api/program/:id',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			validation.validate(validationResult),
		],
		controllers.program.deleteOne
	);

	/**
	 * Focus Item Routes
	 */
	app.get(
		'/api/focusitems',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			validation.validate(validationResult),
		],
		controllers.focusitem.getAll
	);
	app.get(
		'/api/focusitem/:id',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			validation.validate(validationResult),
		],
		controllers.focusitem.getOne
	);
	app.post(
		'/api/focusitem',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			check('name', 'Must contain a name.').exists(),
			check('program', 'Must contain a program.').exists(),
			check('unit', 'Must contain a unit.').exists(),
			check('subunit', 'Student ID must be subunit.').exists(),
			validation.validate(validationResult),
		],
		controllers.focusitem.create
	);
	app.put(
		'/api/focusitem/:id',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			validation.validate(validationResult),
		],
		controllers.focusitem.update
	);
	app.delete(
		'/api/focusitem/:id',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			validation.validate(validationResult),
		],
		controllers.focusitem.deleteOne
	);

	/**
	 * Student Routes
	 */
	app.get(
		'/api/students',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			validation.validate(validationResult),
		],
		controllers.student.getAll
	);
	app.get(
		'/api/student/:id',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			validation.validate(validationResult),
		],
		controllers.student.getOne
	);
	app.post(
		'/api/student',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			check('teacher', 'Must contain an teacher.').exists(),
			check('student_id', 'Must contain an student_id.').exists(),
			check('student_id', 'Student ID must be alphabetic (a-z only).').isAlpha(),
			validation.validate(validationResult),
		],
		controllers.student.create
	);
	app.put(
		'/api/student/:id',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			validation.validate(validationResult),
		],
		controllers.student.update
	);
	app.delete(
		'/api/student/:id',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			validation.validate(validationResult),
		],
		controllers.student.deleteOne
	);

	app.get(
		'/api/teacher',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			validation.validate(validationResult),
		],
		controllers.teacher.getAll
	);
	app.get(
		'/api/teacher/:id',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			validation.validate(validationResult),
		],
		controllers.teacher.getOne
	);
	app.put(
		'/api/teacher/:id',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			validation.validate(validationResult),
		],
		controllers.teacher.update
	);
	app.delete(
		'/api/teacher/:id',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			validation.validate(validationResult),
		],
		controllers.teacher.deleteOne
	);
	app.get(
		'/api/teacher/:id/students',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			validation.validate(validationResult),
		],
		controllers.teacher.getStudents
	);

	/**
	 * Analytics Routes
	 */
	app.post(
		'/api/analytics/hearatale',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			check('student', 'Must contain an student.').exists(),
			check('program', 'Must contain an program.').exists(),
			check('focus_item', 'Must contain an focus_item.').exists(),
			check('time_watching', 'Must contain an time_watching.').exists(),
			check(
				'total_video_time',
				'Must contain an total_video_time.'
			).exists(),
			validation.validate(validationResult),
		],
		controllers.analytics.hearatale
	);

	app.post(
		'/api/analytics/application',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			check('student', 'Must contain an student.').exists(),
			check('program', 'Must contain an program.').exists(),
			check('focus_item', 'Must contain an focus_item.').exists(),
			check('correct_on', 'Must contain an correct_on.').exists(),
			check('time_spent', 'Must contain an time_spent.').exists(),
			validation.validate(validationResult),
		],
		controllers.analytics.application
	);

	app.post(
		'/api/analytics/mostRecent',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			check('student', 'Must contain an student.').exists(),
			validation.validate(validationResult),
		],
		controllers.analytics.analyticsForStudent
	);

	app.post(
		'/api/analytics/focusitem',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			check('focus_item', 'Must contain an focus_item.').exists(),
			validation.validate(validationResult),
		],
		controllers.analytics.focusItem
	);

	app.get(
		'/api/analytics/program',
		[
			passport.authenticate('jwt', PASSPORT_OPTIONS),
			check('program').isMongoId(),
			body().custom(body => {
				if (body.focus_item && body.focus_items) {
					throw new Error(
						'Specify only focus_item or focus_items, not both'
					);
				}
				return Promise.resolve();
			}),
			validation.validate(validationResult),
		],
		controllers.analytics.analytics
	);

	app.get('/api/*', [], controllers.static.apiError);

	// Render React page
	app.get('/*', [], controllers.static.getAll);
};
