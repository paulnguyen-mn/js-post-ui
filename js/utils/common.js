export function setTextContent(parent, selector, text) {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (element) element.textContent = text
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text

  return `${text.slice(0, maxLength - 1)}…`
}

export function setFieldValue(form, fieldSelector, value) {
  if (!form) return

  const field = form.querySelector(fieldSelector)
  if (field) field.value = value
}

export function randomNumberInRange(a, b) {
  if (a >= b) return -1

  const random = Math.random() * (b - a)
  return Math.round(random) + a
}
