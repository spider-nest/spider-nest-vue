#!/bin/sh

set -e

pnpm i
pnpm update:version

pnpm build

find dist/spider-nest-vue/packages -type d -name node_modules -print0 | xargs -0 -I {} rm -rf {}

cd dist/spider-nest-vue
npm publish --access public
cd -

echo "Publish completed"
