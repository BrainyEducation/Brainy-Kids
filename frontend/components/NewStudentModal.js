import React from 'react';
import { Modal, Alert, Row, Button, Input } from 'antd';

export default props => {
	return (
		<Modal
			title="Create New Student"
			centered
			destroyOnClose
			closable={!props.loading}
			maskClosable={!props.loading}
			footer={[
				<Button
					key="back"
					disabled={props.loading}
					onClick={props.onCancel}>
					Cancel
				</Button>,
				<Button
					key="submit"
					loading={props.loading}
					type="primary"
					onClick={props.onOk}>
					Save
				</Button>,
			]}
			{...props}>
			<Alert
				showIcon
				type="info"
				message={`
				Please create your student’s unique 2-letter (and/or number) ID.  It will be added to your 3-letter (and/or number) ID to create a unique 5-letter (and/or number) ID which your student will use to log in to Brainy Phonics, Brainy Sight Words or other Brainy apps.  On this screen you have the option to pair the student’s 2-letter ID with the student’s name or a nickname or some identifier unknown to outsiders.  On the main screen you will have the option to blank out the name, nickname, or identifier when you review student progress and/or print out documents or send emails related to student progress.  You or your school or school system may find this login system inconvenient.  The Brainy apps and the Data Analytics Platform have been created as a public service and are absolutely free.  If your school or school system chooses to add Brainy apps and the Data Analytics Platform to your school server you can store all student data there and use or create your own ID / password system.`}
			/>
			<Row style={{ marginTop: 20 }}>
				<p
					style={{
						margin: 0,
						fontWeight: 'bold',
						display: 'inline-block',
						marginRight: 20,
					}}>
					Student ID
				</p>
				<Input
					disabled={props.loading}
					style={{ display: 'inline-block', maxWidth: '60px' }}
					placeholder="##"
					autoFocus
					maxLength="2"
					onChange={props.onChangeId}
				/>
				<Input
					disabled={props.loading}
					style={{ display: 'inline-block', maxWidth: '130px', marginLeft: 20 }}
					placeholder="Student Name"
					maxLength="32"
					onChange={props.onChangeName}
				/>
			</Row>
		</Modal>
	);
};