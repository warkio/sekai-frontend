// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
// This Source Code Form is "Incompatible With Secondary Licenses",
// as defined by the Mozilla Public License, v. 2.0.

import m from '../../vendor/js/mithril.js';

import { state } from '../state.js';

function activeLinkIfRoute(expectedRouteName, className = 'active') {
    if (typeof expectedRouteName !== 'string') {
        throw new Error('expectedRouteName must be string');
    }
    if (typeof className !== 'string') {
        throw new Error('className must be string');
    }

    if (state.currentRouteName === expectedRouteName) {
        return className;
    }

    return '';
}

const HeaderNav = {
    view: () => {
        const user = state.getData('user');

        let rightNav = null;
        if (user) {
            rightNav = m('ul.right', [
                m('li', {
                    class: activeLinkIfRoute('account'),
                }, [
                    m('a[href="/account"]', {
                        oncreate: m.route.link,
                    }, user.name),
                ]),
                m('li', [
                    m('a[href="/logout"]', {
                        oncreate: m.route.link,
                    }, 'Log out'),
                ]),
            ]);
        } else {
            rightNav = m('ul.right', [
                m('li', {
                    class: activeLinkIfRoute('register'),
                }, [
                    m('a[href="/register"]', {
                        oncreate: m.route.link,
                    }, 'Register'),
                ]),
                m('li', {
                    class: activeLinkIfRoute('login'),
                }, [
                    m('a[href="/login"]', {
                        oncreate: m.route.link,
                    }, 'Login'),
                ]),
            ]);
        }

        return m('nav#main-nav', [
            m('.container', [
                m('ul.left', [
                    m('li', [
                        m('a[href="/"]', {
                            oncreate: m.route.link,
                        }, 'Sekai'),
                    ]),
                ]),
                rightNav,
            ]),
        ]);
    },
};

const Footer = {
    view: () => {
        const firstYear = 2018;
        const currentYear = new Date().getUTCFullYear();

        let yearRange = `${firstYear}-${currentYear}`;
        if (firstYear === currentYear) {
            yearRange = currentYear.toString();
        }

        return m('.container', [
            m('p', [
                `Copyright © ${yearRange} `,
                m('a[href="https://wark.io/"]', 'wark.io'),
            ]),
        ]);
    },
};

const Layout = {
    view: (vnode) => {
        return m('#layout-grid-1', [
            m('header', [
                m(HeaderNav),
            ]),
            m('main', [
                vnode.children
            ]),
            m('footer', [
                m(Footer)
            ]),
        ]);
    },
};

export { Layout };
