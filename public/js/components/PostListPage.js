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
        vnode.state.timestamp = data.timestamp;
    },
    view: (vnode) => {
        const s = vnode.state;

        const userInfo = m('aside.userinfo', [
            m('a', {
                href: `/users/${s.author.id}`,
                oncreate: m.route.link,
            }, [
                m('img.user-profile-pic', {
                    src: s.author.avatar || '/img/no-image.jpg',
                }),
            ]),

            m('.user-link-wrapper', [
                m('a.user-link', {
                    href: `/users/${s.author.id}`,
                    oncreate: m.route.link,
                }, s.author.name),
            ]),

            m('table', [
                m('tr', [
                    m('td', 'Level'),
                    m('td', s.author.level),
                ]),
                m('tr', [
                    m('td', 'EXP'),
                    m('td', s.author.exp),
                ]),
                m('tr', [
                    m('td', 'On-role money'),
                    m('td', s.author.onRolMoney),
                ]),
                m('tr', [
                    m('td', 'Off-role money'),
                    m('td', s.author.offRolMoney),
                ]),
            ]),
        ]);

        const postContent = m('div.post-content', [
            m('time.post-timestamp', {
                datetime: s.timestamp.toISOString(),
            }, s.timestamp.toString()),
            'Post content.'
        ]);

        return m(`article#post-${s.id}.thread-post`, [
            postContent,
            userInfo,
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

        const nextPage = s.currentPage + 1;
        const previousPage = s.currentPage - 1;

        let nextPageLink = null;
        let previousPageLink = null;

        if (nextPage <= s.totalPages) {
            nextPageLink = m('li', m('a', {
                href: m.route.get() + '?page=' + nextPage,
                oncreate: m.route.link,
            }, 'Newer posts ⟶'));
        }

        if (previousPage >= 1) {
            previousPageLink = m('li', m('a', {
                href: m.route.get() + '?page=' + previousPage,
                oncreate: m.route.link,
            }, '⟵ Older posts'));
        }

        const pagination = m('ul.pagination', [
            previousPageLink,
            nextPageLink,
        ]);

        let postsWord = 'post';
        if (s.totalPosts !== 1) {
            postsWord += 's';
        }

        let pagesWord = 'page';
        if (s.totalPages !== 1) {
            pagesWord += 's';
        }

        const postAmount = m('small', `${s.totalPosts} ${postsWord} in ${s.totalPages} ${pagesWord}`);

        return m('#post-list.container', [
            breadcrumb,
            m('h3.thread-title', s.thread.title),
            postAmount,
            m('.posts', posts),
            pagination,
        ]);
    },
};

export { PostListPage };
