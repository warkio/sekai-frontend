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

const SESSION_CACHE_TTL = 10 * 1000;

const INITIAL_DATA = {
    token: null,
    user: null,
};

const state = {
    data: JSON.parse(JSON.stringify(INITIAL_DATA)),

    currentRouteName: null,
    sessionLastCheckedAt: null,
    csrfToken: null,

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

    async getCsrfToken() {
        const method = 'GET';
        const url = resolve('/token');

        const { token } = await m.request({
            method,
            url,
            withCredentials: true,
        });

        state.csrfToken = token;

        return state.csrfToken;
    },

    async refreshSession() {
        if (state.sessionLastCheckedAt === null || Date.now() - state.sessionLastCheckedAt > SESSION_CACHE_TTL) {
            await state.getCsrfToken();
            state.sessionLastCheckedAt = Date.now();

            await state.refreshUserData();
        }
    },

    async refreshUserData() {
        const method = 'GET';
        const url = resolve('/user');

        const resp = await m.request({
            method,
            url,
            withCredentials: true,
        });

        if (Object.keys(resp).length > 0) {
            state.data.user = JSON.parse(JSON.stringify(resp));
        } else {
            state.data.user = null;
        }

        return state.data.user;
    },

    clearSessionCache() {
        state.sessionLastCheckedAt = null;
        state.data.user = null;
    },

    clear() {
        state.clearSessionCache();

        state.data = JSON.parse(JSON.stringify(INITIAL_DATA));
    },

    async login(user, password) {
        if (typeof user !== 'string') {
            throw new Error('user must be string');
        }
        if (typeof password !== 'string') {
            throw new Error('password must be string');
        }

        const method = 'POST';
        const url = resolve('/login');

        const fd = new FormData();
        fd.set('_token', (await state.getCsrfToken()));
        fd.set('email', user);
        fd.set('password', password);

        const resp = await m.request({
            method,
            url,
            withCredentials: true,
            data: fd,
            deserialize: () => {},
        });

        await state.clearSessionCache();

        // TODO: Return boolean indicating success or failure.
    },

    async logout() {
        const method = 'POST';
        const url = resolve('/logout');

        const fd = new FormData();
        fd.set('_token', (await state.getCsrfToken()));

        const resp = await m.request({
            method,
            url,
            withCredentials: true,
            data: fd,
            deserialize: () => {},
        });

        state.clear();
    },

    clearData(key) {
        state.data = JSON.parse(JSON.stringify({
            ...state.data,

            [key]: undefined,
        }));
    },

    getData(key, defaultValue=null) {
        if (typeof key !== 'string') {
            throw new Error('key must be string');
        }
        if (!Object.prototype.hasOwnProperty.call(state.data, key)) {
            state.data[key] = defaultValue;
        }

        return state.data[key];
    },

    async updateForumListPage() {
        const method = 'GET';
        const url = resolve('/categories');

        const resp = await m.request({
            method,
            url,
            withCredentials: true,
        });

        const categories = resp.content;
        if (Array.isArray(categories)) {
            state.data.forumListPage = {
                categories,
            };
        } else {
            state.data.forumListPage = null;
        }
    },
};

export { state };
