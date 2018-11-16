// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
// This Source Code Form is "Incompatible With Secondary Licenses",
// as defined by the Mozilla Public License, v. 2.0.

import m from '../vendor/js/mithril.js';

const API_URL_PREFIX = 'https://api.sekai.wark.io/';
const APP_NAME = 'Sekai';

function resolve(path) {
    if (typeof path !== 'string') {
        throw new Error('path must be string');
    }

    while (path.match(/^[\/\.]/)) {
        path = path.substr(1);
    }

    return API_URL_PREFIX + path;
}

const INITIAL_DATA = {
    token: null,
};

const state = {
    data: JSON.parse(JSON.stringify(INITIAL_DATA)),

    currentRouteName: null,

    setTitle(title=null) {
        if (title === null) {
            title = '';
        }
        if (typeof title !== 'string') {
            throw new Error('title must be string');
        }

        title = title.trim();
        if (title) {
            document.title = title + ' — ' + APP_NAME;
        } else {
            document.title = APP_NAME;
        }
    },

    setCurrentRouteName(name) {
        if (name !== null && typeof name !== 'string') {
            throw new Error('name must be string or null');
        }
        if (name === null) {
            state.currentPage = null;

            return;
        }

        if (name !== name.trim()) {
            throw new Error('name must not contain leading or trailing spaces');
        }

        state.currentRouteName = name;
    },

    getToken() {
        const method = 'GET';
        const url = resolve('/token');

        return m.request({
            method,
            url,
            withCredentials: true,
        })
            .then((resp) => {
                console.log(resp);
            })
            .catch((err) => {
                console.error(err.stack);
            });
    },
};

export { state };
