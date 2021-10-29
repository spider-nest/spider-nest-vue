import { existsSync, writeFileSync, readFileSync } from 'fs-extra'

const cooking = 'cooking.vue'
const example = 'cooking.vue.example'

if (!existsSync(cooking)) {
  writeFileSync(cooking, readFileSync(example))
}
