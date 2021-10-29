# Spider Nest Vue

A vue.js ui library for web.

[![NPM version](https://img.shields.io/npm/v/spider-nest-vue.svg)](https://npmjs.org/package/spider-nest-vue)
[![NPM downloads](http://img.shields.io/npm/dm/spider-nest-vue.svg)](https://npmjs.org/package/spider-nest-vue)
[![Release](https://img.shields.io/github/v/release/spider-nest/spider-nest-vue)](https://github.com/spider-nest/spider-nest-vue/releases/latest)
[![MIT](https://img.shields.io/github/license/spider-nest/spider-nest-vue)](https://cdn.jsdelivr.net/gh/spider-nest/spider-nest-vue@main/LICENSE)

## Install dependencies

```
$ pnpm i
```

## Docs preview

```
$ pnpm docs:dev
```

## Local development

1. Start the local development environment

```
$ pnpm dev
```

2. Add a component into `cooking/cooking.vue`

> cooking.vue

```
<script setup>
// make sure this component is registered in @spider-nest-vue/components
import { ComponentDeveloping } from '@spider-nest-vue/components'
</script>

<template>
  <ComponentDeveloping />
</template>
```

## Thanks

Reference from [Element-Plus](https://github.com/element-plus/element-plus)
