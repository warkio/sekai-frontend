// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
// This Source Code Form is "Incompatible With Secondary Licenses",
// as defined by the Mozilla Public License, v. 2.0.

import m from '../../vendor/js/mithril.js';

import { state } from '../state.js';

const STATE_KEY = 'forumListPage';

const ForumCategorySection = {
    oninit: (vnode) => {
        const { data } = vnode.attrs;

        vnode.state.id = data.id;
        vnode.state.title = data.name;
    },
    view: (vnode) => {
        const s = vnode.state;

        return m(`section#section-${s.id}.section`, [
            m('h4', [
                m('a', {
                    href: `/sections/${s.id}`,
                    oncreate: m.route.link,
                }, s.title)
            ]),
        ]);
    },
};

const ForumCategory = {
    oninit: (vnode) => {
        const { data } = vnode.attrs;

        vnode.state.id = data.id;
        vnode.state.title = data.name;
        vnode.state.sections = data.sections;
    },
    view: (vnode) => {
        const s = vnode.state;

        const sections = s.sections.map(rawSection => (
            m(ForumCategorySection, {
                data: rawSection,
            })
        ));

        return m(`section#category-${s.id}.category`, [
            m('h3', [
                s.title,
            ]),
            ...sections,
        ]);
    },
};

const ForumListPage = {
    view: () => {
        const s = state.getData(STATE_KEY, {
            categories: [],
        });

        const categories = s.categories.map(rawCategory => (
            m(
                ForumCategory,
                {
                    data: rawCategory,
                },
                rawCategory.sections.map(rawSection => (
                    m(ForumCategorySection)
                ))
            )
        ));

        return m('#forum-list.container', categories);
    },
};

export { ForumListPage };
