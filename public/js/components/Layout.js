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
        // FIXME
        const isLoggedIn = false;

        let rightNav = null;
        if (isLoggedIn) {
            // TODO
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
        return m('.container', [
            m('p', [
                'Copyright © 2018 ',
                m('a[href="https://wark.io/"]', {
                    oncreate: m.route.link,
                }, 'wark.io'),
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
