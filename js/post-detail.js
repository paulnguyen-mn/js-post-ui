import dayjs from 'dayjs'
import postApi from './api/postApi'
import { setTextContent } from './utils'

// id="goToEditPageLink"
// id="postHeroImage"
// id="postDetailTitle"
// id="postDetailAuthor"
// id="postDetailTimeSpan"
// id="postDetailDescription"

// author: "Dustin Moore"
// createdAt: 1633700485641
// description: "ipsum iusto officiis rerum quidem minus earum minus eum dolorum numquam qui eveniet quisquam ipsa vero enim deleniti et numquam voluptatibus dolorum excepturi eius autem labore quo quo quo in consequuntur veniam consequatur aperiam in voluptas aliquid assumenda enim quo autem rerum consequatur ut consequatur sint nulla nostrum non beatae"
// id: "sktwi1cgkkuif36ef"
// imageUrl: "https://picsum.photos/id/960/1368/400"
// title: "Molestiae tempora voluptatibus"
// updatedAt: 1633700485641

function renderPostDetail(post) {
  if (!post) return

  // render title
  // render description
  // render author
  // render updatedAt
  setTextContent(document, '#postDetailTitle', post.title)
  setTextContent(document, '#postDetailDescription', post.description)
  setTextContent(document, '#postDetailAuthor', post.author)
  setTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(post.updatedAt).format(' - DD/MM/YYYY HH:mm')
  )

  // render hero image (imageUrl)
  const heroImage = document.getElementById('postHeroImage')
  if (heroImage) {
    heroImage.style.backgroundImage = `url("${post.imageUrl}")`

    heroImage.addEventListener('error', () => {
      thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=thumbnail'
    })
  }

  // render edit page link
  const editPageLink = document.getElementById('goToEditPageLink')
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`
    // editPageLink.textContent = 'Edit Post'
    editPageLink.innerHTML = '<i class="fas fa-edit"></i> Edit Post'
  }
}

;(async () => {
  // get post id from URL
  // fetch post detail API
  // render post detail
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')
    if (!postId) {
      console.log('Post not found')
      return
    }

    const post = await postApi.getById(postId)
    renderPostDetail(post)
  } catch (error) {
    console.log('failed to fetch post detail', error)
  }
})()
