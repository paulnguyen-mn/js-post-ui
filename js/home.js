import postApi from './api/postApi'
import { initPagination, initSearchInput, renderPagination, renderPostList } from './utils'

function fetchAndRenderPostList(queryParams) {
  const { data, pagination } = await postApi.getAll(queryParams)
  renderPostList(data)
  renderPagination('pagination', pagination)
}

async function handleFilterChange(filterName, filterValue) {
  try {
    // update query params
    const url = new URL(window.location)
    url.searchParams.set(filterName, filterValue)

    // reset page if needed
    const FILTER_THAT_NEED_PAGE_RESET = ['title_like']
    if (FILTER_THAT_NEED_PAGE_RESET.includes(filterName)) {
      url.searchParams.set('_page', 1)
    }

    history.pushState({}, '', url)
    fetchAndRenderPostList(url.searchParams)
  } catch (error) {
    console.log('failed to fetch post list', error)
  }
}

function getDefaultQueryParams() {
  const url = new URL(window.location)

  // update search params if needed
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

  history.pushState({}, '', url)
  return url.searchParams
}

;(async () => {
  try {
    const queryParams = getDefaultQueryParams()

    // attach click event for links
    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    })

    initSearchInput({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    })

    fetchAndRenderPostList(queryParams)
  } catch (error) {
    console.log('get all failed', error)
    // show modal, toast error
  }
})()
