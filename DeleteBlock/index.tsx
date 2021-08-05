import React from 'react';
import './delete-block.scss'

export interface DeleteBlockProps {};

export const DeleteBlock: React.FC<DeleteBlockProps> = ({ children }) => {

	return (
		<div>{children}</div>
	);
}