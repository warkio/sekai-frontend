#!/bin/sh

./node_modules/.bin/rollup public/sekai.js --format iife \
| ./node_modules/.bin/uglifyjs -c -m \
> public/bundle.js

BUNDLEHASH=$(cat public/bundle.js | openssl dgst -sha384 -binary | openssl base64 -A)

grep -v sekai.js public/index.html > public/index.production.html
echo '<script defer src="/bundle.js" integrity="sha384-'${BUNDLEHASH}'"></script>' >> public/index.production.html
