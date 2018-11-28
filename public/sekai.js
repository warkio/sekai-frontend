// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
// This Source Code Form is "Incompatible With Secondary Licenses",
// as defined by the Mozilla Public License, v. 2.0.

import m from './vendor/js/mithril.js';

import { Layout } from './js/components/Layout.js';
import { ForumListPage } from './js/components/ForumListPage.js';
import { LoginPage } from './js/components/LoginPage.js';
import { RegisterPage } from './js/components/RegisterPage.js';

import { state } from './js/state.js';

m.route(document.body, '/', {
    '/': {
        onmatch: async () => {
            await state.refreshSession();
        },
        render: () => {
            state.setCurrentRouteName('forumList');
            state.setTitle();

            return m(Layout, m(ForumListPage));
        },
    },
    '/login': {
        onmatch: async () => {
            await state.refreshSession();
        },
        render: () => {
            if (state.data.user) {
                m.route.set('/');

                return;
            }

            state.setCurrentRouteName('login');
            state.setTitle('Login');

            return m(Layout, m(LoginPage));
        },
    },
    '/register': {
        onmatch: async () => {
            await state.refreshSession();
        },
        render: () => {
            if (state.data.user) {
                m.route.set('/');

                return;
            }

            state.setCurrentRouteName('register');
            state.setTitle('Register');

            return m(Layout, m(RegisterPage));
        },
    },
    '/logout': {
        onmatch: async () => {
            await state.logout();
        },
        render: () => {
            m.route.set('/');
        },
    },
});
