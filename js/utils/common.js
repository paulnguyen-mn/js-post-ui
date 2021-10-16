export function setTextContent(parent, selector, text) {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (element) element.textContent = text
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text

  return `${text.slice(0, maxLength - 1)}…`
}
