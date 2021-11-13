import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { setTextContent, truncateText } from './common'

// to use fromNow func
dayjs.extend(relativeTime)

export function createPostElement(post) {
  if (!post) return

  // find and clone template
  const postTemplate = document.getElementById('postTemplate')
  if (!postTemplate) return

  const liElement = postTemplate.content.firstElementChild.cloneNode(true)
  if (!liElement) return

  // update title, description, author, thumbnail
  setTextContent(liElement, '[data-id="title"]', post.title)
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100))
  setTextContent(liElement, '[data-id="author"]', post.author)
  setTextContent(liElement, '[data-id="timeSpan"]', ` - ${dayjs(post.updatedAt).fromNow()}`)

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]')
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl

    thumbnailElement.addEventListener('error', () => {
      console.log('load image error --> use default placeholder')
      thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=thumbnail'
    })
  }

  // attach events
  // go to post detail when click on div.post-item
  const divElement = liElement.firstElementChild
  if (divElement) {
    divElement.addEventListener('click', (event) => {
      // S2: if event is triggered from menu --> ignore
      const menu = liElement.querySelector('[data-id="menu"]')
      if (menu && menu.contains(event.target)) return

      window.location.assign(`/post-detail.html?id=${post.id}`)
    })
  }

  // add click event for edit button
  const editButton = liElement.querySelector('[data-id="edit"]')
  if (editButton) {
    editButton.addEventListener('click', (e) => {
      // S1: prevent event bubbling to parent
      // e.stopPropagation()
      window.location.assign(`/add-edit-post.html?id=${post.id}`)
    })
  }

  // add click event for remove button
  const removeButton = liElement.querySelector('[data-id="remove"]')
  if (removeButton) {
    removeButton.addEventListener('click', () => {
      const customEvent = new CustomEvent('post-delete', {
        bubbles: true,
        detail: post,
      })

      removeButton.dispatchEvent(customEvent)
    })
  }

  return liElement
}

export function renderPostList(elementId, postList) {
  if (!Array.isArray(postList)) return

  const ulElement = document.getElementById(elementId)
  if (!ulElement) return

  // clear current list
  ulElement.textContent = ''

  postList.forEach((post) => {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  })
}
