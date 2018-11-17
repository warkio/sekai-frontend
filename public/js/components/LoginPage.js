// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
// This Source Code Form is "Incompatible With Secondary Licenses",
// as defined by the Mozilla Public License, v. 2.0.

import m from '../../vendor/js/mithril.js';

import { state } from '../state.js';

const STATE_KEY = 'loginPage';

const LoginPage = {
    view: () => {
        const s = state.getData(STATE_KEY, {
            user: '',
            password: '',
        });

        return m('form.login', {
            onsubmit: (e) => {
                e.preventDefault();

                const {
                    user,
                    password,
                } = s;

                state.login(user, password)
                    .then((result) => {
                        console.log(result);
                    });
            },
        }, [
            m('input[type="text"]', {
                tabindex: 1,
                placeholder: 'Email',
                oninput: m.withAttr('value', (value) => {
                    s.user = value;
                }),
                value: s.user,
            }),
            m('input[type="password"]', {
                tabindex: 2,
                placeholder: 'Password',
                oninput: m.withAttr('value', (value) => {
                    s.password = value;
                }),
                value: s.password,
            }),
            m('button[type="submit"]', {
                tabindex: 3,
            }, [
                'Log in',
            ]),
        ]);
    },
};

export { LoginPage };
