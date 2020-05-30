import propTypes from 'prop-types';
import React, { Component } from 'react';

import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import AuthGuard from './components/AuthGuard';

import ForgotPassword from './containers/ForgotPassword';
import Account from './containers/Account';
import ChangePassword from './containers/ChangePassword';
import ChangeTeacherId from './containers/ChangeTeacherId';
import LoginPage from './containers/LoginPage';
import Register from './containers/Register';
import LogoutPage from './containers/LogoutPage';
import Dashboard from './containers/Dashboard';
import Programs from './containers/Programs';
import ProgramDetail from './containers/ProgramDetail';
import ProgramFocusItemDetail from './containers/ProgramFocusItemDetail';
import Students from './containers/Students';
import StudentShow from './containers/StudentShow';


import NotFound from './containers/NotFound';

const Routes = () => {
	return (
		<Switch>
			<Route path="/" exact component={LoginPage} />
			<Route path="/register" exact component={Register} />
			<Route path="/forgot" exact component={ForgotPassword} />
			<AuthGuard path="/dashboard" exact component={Dashboard} />
			<AuthGuard path="/programs" exact component={Programs} />
			<AuthGuard
				path="/program/:id/:unit?/:subunit?"
				exact
				component={ProgramDetail}
			/>
			<AuthGuard
				path="/program/:id/:unit/:subunit/:focus_item"
				exact
				component={ProgramFocusItemDetail}
			/>
			<AuthGuard path="/students" exact component={Students} />
			<AuthGuard path="/student/:id" exact component={StudentShow} />
			<AuthGuard path="/account" exact component={Account} />
			<AuthGuard
				path="/account/password"
				exact
				component={ChangePassword}
			/>
			<AuthGuard
				path="/account/teacherid"
				exact
				component={ChangeTeacherId}
			/>
			<Route path="/logout" exact component={LogoutPage} />
			<Route path="*" component={NotFound} />
		</Switch>
	);
};

export default Routes;
