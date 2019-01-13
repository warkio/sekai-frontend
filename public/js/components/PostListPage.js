// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
// This Source Code Form is "Incompatible With Secondary Licenses",
// as defined by the Mozilla Public License, v. 2.0.

import m from '../../vendor/js/mithril.js';

import { state } from '../state.js';

const STATE_KEY = 'postListPage';

const ThreadPost = {
    oninit: (vnode) => {
        const { data } = vnode.attrs;

        vnode.state.id = data.id;
        vnode.state.title = data.name;
        vnode.state.author = data.user;
    },
    view: (vnode) => {
        const s = vnode.state;
        const { author } = s;

        return m('tr', [
            m('td.collapse', [
                // Image based on read/unread state.
            ]),
            m('td.expand', [
                m('p', [
                    m('a', {
                        href: `/threads/${s.id}`,
                        oncreate: m.route.link,
                    }, s.title)
                ]),
                m('p', [
                    m('a', {
                        href: `/users/${author.id}`,
                        oncreate: m.route.link,
                    }, author.name),
                ]),
            ]),
            m('td.collapse', [
                // Last post information.
            ]),
        ]);
    },
};

const PostListPage = {
    view: () => {
        const s = state.getData(STATE_KEY, {
            thread: null,
            posts: [],
            postsPerPage: 15,
            section: null,
        });

        const posts = s.posts.map(rawPost => (
            m(ThreadPost, {
                data: rawPost,
            })
        ));

        const breadcrumb = m('ul.breadcrumb', [
            m('li', m('a', {
                href: `/`,
                oncreate: m.route.link,
            }, 'Sekai')),
            m('li', m('a', {
                href: `/sections/${s.section.id}`,
                oncreate: m.route.link,
            }, s.section.title)),
            m('li', s.thread.title),
        ]);

        return m('#post-list.container', [
            breadcrumb,
            m('h3.thread-title', s.thread.title),
            m('.posts', posts),
        ]);
    },
};

export { PostListPage };
