// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
// This Source Code Form is "Incompatible With Secondary Licenses",
// as defined by the Mozilla Public License, v. 2.0.

function formatTime(d) {
    let ut = null;

    if (Number.isInteger(d)) {
        ut = d;
    } else if (d instanceof Date) {
        ut = d.getTime();
    } else {
        throw new Error('d must be integer or instance of Date');
    }

    let diff = Date.now() - ut;

    let prefix = '';
    let suffix = '';

    if (diff < 0) {
        prefix = 'in';
        diff = -diff;
    } else {
        suffix = 'ago';
    }

    let timeStr = '';

    // Seconds.
    let t = Math.floor(diff / 1000);
    if (t < 60) {
        timeStr = 'less than a minute';
    } else if (t < 60 * 60) {
        const n = Math.floor(t / 60);
        timeStr = n.toString() + ' minute';
        if (n > 1) {
            timeStr += 's';
        }
    } else if (t < 60 * 60 * 24) {
        const n = Math.floor(t / 60 / 60).toString();
        timeStr = n.toString() + ' hour';
        if (n > 1) {
            timeStr += 's';
        }
    } else {
        prefix = '';
        suffix = '';

        const parts = new Date(ut).toISOString().split('T');
        timeStr = parts[0] + ' ' + parts[1].split(':').slice(0, 2).join(':');
        timeStr += ' (UTC)';
    }

    return [
        prefix,
        timeStr,
        suffix,
    ]
        .map(part => part.trim())
        .filter(part => !!part)
        .join(' ');
}

export { formatTime };
