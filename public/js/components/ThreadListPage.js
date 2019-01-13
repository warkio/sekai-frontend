// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
// This Source Code Form is "Incompatible With Secondary Licenses",
// as defined by the Mozilla Public License, v. 2.0.

import m from '../../vendor/js/mithril.js';

import { state } from '../state.js';
import { formatTime } from '../time.js';

const STATE_KEY = 'threadListPage';

const SectionThread = {
    oninit: (vnode) => {
        const { data } = vnode.attrs;

        vnode.state.id = data.id;
        vnode.state.title = data.name;
        vnode.state.author = data.user;
        vnode.state.lastPost = {
            author: data.lastPost.user,
            timestamp: data.lastPost.date && new Date(data.lastPost.date),
        };
    },
    view: (vnode) => {
        const s = vnode.state;
        const { author } = s;

        return m('tr', [
            m('td.collapse', [
                // Image based on read/unread state.
            ]),
            m('td.expand', [
                m('p.post', [
                    m('a', {
                        href: `/threads/${s.id}`,
                        oncreate: m.route.link,
                    }, s.title)
                ]),
                m('p.post-author', [
                    'by ',
                    m('a', {
                        href: `/users/${author.id}`,
                        oncreate: m.route.link,
                    }, author.name),
                ]),
            ]),
            m('td.collapse.last-post-column', [
                formatTime(s.lastPost.timestamp),
                ' by ',
                m('a', {
                    href: `/users/${s.lastPost.author.id}`,
                    oncreate: m.route.link,
                }, s.lastPost.author.name),
            ]),
        ]);
    },
};

const ThreadListPage = {
    view: () => {
        const s = state.getData(STATE_KEY, {
            pinnedThreads: [],
            threads: [],
            threadPerPage: 15,
        });

        function mapThreads(rawThread) {
            return m(SectionThread, {
                data: rawThread,
            });
        }

        const pinnedThreads = s.pinnedThreads.map(mapThreads);
        const threads = s.threads.map(mapThreads);

        const threadRows = [
            ...pinnedThreads,
            ...threads,
        ];

        let noThreadsMessage = null
        if (threadRows.length === 0) {
            noThreadsMessage = m('p', 'No threads.');
        }

        const breadcrumb = m('ul.breadcrumb', [
            m('li', m('a', {
                href: `/`,
                oncreate: m.route.link,
            }, 'Sekai')),
            m('li', s.section.title),
        ]);

        const threadsTable = m('table.threads', [
            m('thead', [
                m('tr', [
                    m('th.collapse', ''),
                    m('th.expand', 'Title'),
                    m('th.collapse', 'Last post'),
                ]),
            ]),
            m('tbody', threadRows),
        ]);

        const nextPage = s.currentPage + 1;
        const previousPage = s.currentPage - 1;

        let nextPageLink = null;
        let previousPageLink = null;

        if (nextPage <= s.totalPages) {
            nextPageLink = m('li', m('a', {
                href: m.route.get() + '?page=' + nextPage,
                oncreate: m.route.link,
            }, 'Older threads ⟶'));
        }

        if (previousPage >= 1) {
            previousPageLink = m('li', m('a', {
                href: m.route.get() + '?page=' + previousPage,
                oncreate: m.route.link,
            }, '⟵ Newer threads'));
        }

        const pagination = m('ul.pagination', [
            previousPageLink,
            nextPageLink,
        ]);

        return m('#thread-list.container', [
            breadcrumb,
            threadsTable,
            noThreadsMessage,
            pagination,
        ]);
    },
};
;
export { ThreadListPage };
