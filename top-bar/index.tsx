import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => {});

export interface TopBarProps {};

export const TopBar: React.FC<TopBarProps> = ({ children }) => {

	const classes = useStyles();

	return (
		<div>{children}</div>
	);
}