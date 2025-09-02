export default function diffWords(str1, str2) {
  const words1 = str1.split(/\s+/)
  const words2 = str2.split(/\s+/)

  const max = Math.max(words1.length, words2.length)
  let result = []

  for (let i = 0; i < max; i++) {
    const w1 = words1[i] ?? ''
    const w2 = words2[i] ?? ''

    if (w1 === w2) {
      result.push(w2)
    } else {
      result.push(diffChars(w1, w2))
    }
  }

  return result.join(' ')
}

function diffChars(a, b) {
  let out = ''
  const max = Math.max(a.length, b.length)

  for (let i = 0; i < max; i++) {
    if (a[i] !== b[i]) {
      out += `<span style="color:red">${b[i] ?? ''}</span>`
    } else {
      out += b[i]
    }
  }

  return out
}
