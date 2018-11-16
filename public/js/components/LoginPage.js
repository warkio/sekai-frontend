// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
// This Source Code Form is "Incompatible With Secondary Licenses",
// as defined by the Mozilla Public License, v. 2.0.

import m from '../../vendor/js/mithril.js';

const LoginPage = {
    view: () => {
        return m('form.login', {
            onsubmit: (e) => {
                e.preventDefault();

                // TODO
            },
        }, [
            m('input[type="text"]#input-email', {
                tabindex: 1,
                placeholder: 'Email',
            }),
            m('input[type="password"]', {
                tabindex: 2,
                placeholder: 'Password',
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
