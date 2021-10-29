let IDX = 256,
  BUFFER
const HEX: string[] = []
while (IDX--) HEX[IDX] = (IDX + 256).toString(16).substring(1)

/**
 * The default is "non-secure", which uses Math.random to produce UUIDs.
 * @see https://github.com/lukeed/uuid
 * @returns {string}
 */
const uuid = (): string => {
  let i = 0,
    num,
    out = ''

  if (!BUFFER || IDX + 16 > 256) {
    BUFFER = Array((i = 256))
    while (i--) BUFFER[i] = (256 * Math.random()) | 0
    i = IDX = 0
  }

  for (; i < 16; i++) {
    num = BUFFER[IDX + i]
    if (i === 6) out += HEX[(num & 15) | 64]
    else if (i === 8) out += HEX[(num & 63) | 128]
    else out += HEX[num]

    if (i & 1 && i > 1 && i < 11) out += '-'
  }

  IDX++
  return out
}

export default uuid
