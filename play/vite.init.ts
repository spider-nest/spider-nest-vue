import { existsSync, writeFileSync, readFileSync } from 'fs'

const play = 'play.vue'
const example = 'play.vue.example'

if (!existsSync(play)) {
  writeFileSync(play, readFileSync(example))
}
