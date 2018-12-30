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
        });

        function mapThreads(rawThread) {
            return m(SectionThread, {
                data: rawThread,
            });
        }

        const pinnedThreads = s.pinnedThreads.map(mapThreads);
        const threads = s.threads.map(mapThreads);

        let pinnedThreadsWrapper = null;
        if (pinnedThreads.length > 0) {
            pinnedThreadsWrapper = m('table.pinned-threads', pinnedThreads);
        }

        return m('#thread-list.container', [
            pinnedThreadsWrapper,

            m('table.threads', [
                m('thead', [
                    m('tr', [
                        m('th.collapse', ''),
                        m('th.expand', 'Title'),
                        m('th.collapse', 'Last post'),
                    ]),
                ]),
                m('tbody', threads),
            ]),
        ]);
    },
};
;
export { ThreadListPage };
