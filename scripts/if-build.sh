#!/bin/sh

if [ ! -d "dist/spider-nest-vue" ]; then
  pnpm build
fi
