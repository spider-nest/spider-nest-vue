import { isServer } from './is'

const globalNodes: HTMLElement[] = []

let target = isServer ? undefined : document.body

export function createGlobalNode(id = undefined) {
  const el = document.createElement('div')

  if (id !== undefined) {
    el.id = id
  }

  target && target.appendChild(el)
  globalNodes.push(el)

  return el
}

export function removeGlobalNode(el: HTMLElement) {
  globalNodes.splice(globalNodes.indexOf(el), 1)
  el.remove()
}

export function changeGlobalNodesTarget(el: HTMLElement) {
  if (el !== target) {
    target = el

    globalNodes.forEach((el) => {
      if (!el.contains(target as Node)) {
        target && target.appendChild(el)
      }
    })
  }
}
