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
				Please enter this student's unique 2-letter ID. It will be
				appened to your teacher ID to generate a unique 5-letter ID for
				this student to log into the various applications with.
				
				We recommend using the students first name and surname initial only for privacy.`}
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