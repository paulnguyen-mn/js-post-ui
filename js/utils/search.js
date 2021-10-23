import debounce from 'lodash.debounce'

export function initSearchInput({ elementId, defaultParams, onChange }) {
  const searchInput = document.getElementById(elementId)
  if (!searchInput) return

  // set default value
  searchInput.value = defaultParams.get('title_like')

  const debounceSearch = debounce((event) => onChange?.(event.target.value), 500)
  searchInput.addEventListener('input', debounceSearch)
}
