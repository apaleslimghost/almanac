import React from 'react';
import {LoginBox} from 'meteor/universe:accounts-ui';
import {Accounts} from 'meteor/accounts-base'
import {navigate} from 'meteor/quarterto:reactive-history';

Accounts.onLogin(() => navigate('/'));

export default () => <LoginBox />;
