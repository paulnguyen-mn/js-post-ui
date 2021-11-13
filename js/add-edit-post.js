import postApi from './api/postApi'
import { initPostForm } from './utils'

async function handlePostFormSubmit(formValues) {
  // console.log('submit from parent', formValues)
  try {
    // check add/edit mode
    // S1: based on search params (check id)
    // S2: check id in formValues
    // call API
    const savedPost = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues)

    // show success message
    // redirect to detail page
    window.location.assign(`/post-detail.html?id=${savedPost.id}`)
  } catch (error) {
    console.log('failed to save post', error)
  }
}

// MAIN
;(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')

    const defaultValues = Boolean(postId)
      ? await postApi.getById(postId)
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        }

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: handlePostFormSubmit,
    })
  } catch (error) {
    console.log('failed to fetch post details:', error)
  }
})()
