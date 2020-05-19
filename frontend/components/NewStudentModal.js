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
				Please enter this student's unique 2-digit ID number. It will be
				appened to your teacher ID to generate a unique 5-digit ID for
				this student to log into the various applications with. We
				recommend storing the names associated with these IDs in an
				Excel spreadsheet.`}
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
					onChange={props.onChange}
				/>
			</Row>
		</Modal>
	);
};
