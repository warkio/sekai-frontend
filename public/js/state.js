// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
// This Source Code Form is "Incompatible With Secondary Licenses",
// as defined by the Mozilla Public License, v. 2.0.

import m from '../vendor/js/mithril.js';

const API_URL_PREFIX = 'https://api.sekai.wark.io/';
const APP_NAME = 'Sekai';

function resolve(path, queryParams = {}) {
    if (typeof path !== 'string') {
        throw new Error('path must be string');
    }
    if (typeof queryParams !== 'object') {
        throw new Error('queryParams must be object');
    }

    while (path.match(/^[\/\.]/)) {
        path = path.substr(1);
    }

    const qs = Object.keys(queryParams)
        .map(key => ([
            encodeURIComponent(key),
            encodeURIComponent(queryParams[key]),
        ]))
        .map(pair => pair.join('='))
        .join('&');

    let result = API_URL_PREFIX + path;

    if (qs.length > 0) {
        result += '?' + qs;
    }

    return result;
}

async function httpGet(path, queryParams) {
    const method = 'GET';
    const url = resolve(path, queryParams);

    return m.request({
        method,
        url,
        withCredentials: true,
    });
}

async function httpGetBackground(path, queryParams) {
    const method = 'GET';
    const url = resolve(path, queryParams);

    return m.request({
        method,
        url,
        withCredentials: true,
        background: true,
    });
}

const SESSION_CACHE_TTL = 1 * 60 * 1000;

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
        const { token } = await httpGet('/token');

        state.csrfToken = token;

        return state.csrfToken;
    },

    async refreshSession() {
        if (state.sessionLastCheckedAt === null || Date.now() - state.sessionLastCheckedAt > SESSION_CACHE_TTL) {
            await state.refreshUserData();
            state.sessionLastCheckedAt = Date.now();
        }
    },

    async refreshUserData() {
        const resp = await httpGet('/user');

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

        return true;
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
        const resp = await httpGetBackground('/categories');

        const categories = resp.content;
        if (Array.isArray(categories)) {
            state.data.forumListPage = {
                categories,
            };
        } else {
            state.data.forumListPage = null;
        }
    },

    async getThreads(sectionId, page = 1) {
        if (!Number.isInteger(sectionId)) {
            throw new Error('sectionId must be integer');
        }
        if (!Number.isInteger(page)) {
            throw new Error('page must be integer');
        }

        const resp = await httpGet('/threads', {
            'section-id': sectionId,
            page,
        });

        let threads = resp.content;
        if (!Array.isArray(threads)) {
            threads = null;
        }

        let pinnedThreads = resp.pinned;
        if (!Array.isArray(pinnedThreads)) {
            pinnedThreads = null;
        }

        const section = {
            id: sectionId,
            title: await state.getSectionTitle(sectionId),
        };

        const currentPage = page|0;
        const threadsPerPage = 15;
        const totalPages = Math.ceil(resp.total / threadsPerPage);

        if (threads || pinnedThreads) {
            state.data.threadListPage = {
                pinnedThreads,
                threads,
                section,
                currentPage,
                threadsPerPage,
                totalPages,
            };
        } else {
            state.data.threadListPage = null;
        }
    },

    async getSectionTitle(sectionId) {
        if (!Number.isInteger(sectionId)) {
            throw new Error('sectionId must be integer');
        }
        if (!state.data.forumListPage) {
            await state.updateForumListPage();
        }

        const { categories } = state.data.forumListPage;
        for (let i = 0; i < categories.length; i++) {
            const { sections } = categories[i];
            for (let j = 0; j < sections.length; j++) {
                const section = sections[j];
                if (section.id === sectionId) {
                    return section.name;
                }
            }
        }

        return null;
    },

    async getPosts(threadId, page = 1) {
        if (!Number.isInteger(threadId)) {
            throw new Error('threadId must be integer');
        }
        if (!Number.isInteger(page)) {
            throw new Error('page must be integer');
        }

        const resp = await httpGet('/posts', {
            'thread-id': threadId,
            page,
        });

        const posts = resp.content
            .map(p => ({
                ...p,

                user: {
                    id: p.userId,

                    ...resp.users[p.userId],
                },
                timestamp: new Date(p.date),
            }));

        const thread = {
            title: posts[0].threadName,
        };

        let sectionId = null;
        if (posts.length > 0) {
            sectionId = posts[0].sectionId;
        }

        let section = null;
        if (sectionId !== null) {
            section = {
                id: sectionId,
                title: await state.getSectionTitle(sectionId),
            };
        }

        const postsPerPage = 15;
        const currentPage = page|0;
        const totalPages = Math.ceil(resp.total / postsPerPage);

        if (Array.isArray(posts)) {
            state.data.postListPage = {
                thread,
                posts,
                section,
                currentPage,
                postsPerPage,
                totalPages,
            };
        } else {
            state.data.postListPage = null;
        }
    },
};

export { state };
