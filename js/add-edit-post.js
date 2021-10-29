import postApi from './api/postApi'
import { ImageSource } from './constants'
import { initPostForm } from './utils/post-form'

function jsonToFormData(formValues) {
  const formData = new FormData()

  Object.keys(formValues).forEach((key) => {
    formData.append(key, formValues[key])
  })

  return formData
}

async function handleSubmit(formValues) {
  try {
    console.log('submit', formValues)
    const isEdit = Boolean(formValues.id)

    const payload =
      formValues.imageSource === ImageSource.PICSUM ? formValues : jsonToFormData(formValues)

    const jsonAction = isEdit ? postApi.update : postApi.add
    const formDataAction = isEdit ? postApi.updateFormData : postApi.addFormData
    const action = formValues.imageSource === ImageSource.PICSUM ? jsonAction : formDataAction

    await action(payload)
  } catch (error) {
    console.log('failed to submit form', error)
  }
}

// MAIN
;(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')

    // add or edit
    // fetch post detail by id
    const defaultValues = postId
      ? await postApi.getById(postId)
      : { title: '', description: '', author: '', imageUrl: '' }

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: handleSubmit,
    })
  } catch (error) {
    console.log('failed to init post form', error)
  }
})()
