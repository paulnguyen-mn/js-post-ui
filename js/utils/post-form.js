import * as yup from 'yup'
import { ImageSource } from '../constants'
import { randomNumberInRange, setFieldValue } from './common'

function getFormSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter post title'),
    description: yup.string().required(),
    author: yup.string().required(),
    imageSource: yup
      .string()
      .oneOf(
        [ImageSource.PICSUM, ImageSource.UPLOAD],
        'Invalid image source. Only support: manual and random.'
      ),
    imageUrl: yup.string().when('imageSource', {
      is: 'picsum',
      then: yup.string().required('Please random an image using picsum.photos'),
    }),
    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: yup.mixed().required('Please select an image to upload'),
      // .test('size-max-50-kb', 'Max size 50kb exeed. Please use a smaller size.', (file) => {
      //   if (!file) return false

      //   return file.size <= 50 * 1024 // 50kb
      // }),
    }),
  })
}

function getFormValues(form) {
  const formValues = {}
  ;['title', 'author', 'description'].forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`)
    if (!field) return

    formValues[name] = field.value
  })

  // get image source
  formValues.imageSource =
    form.querySelector('[name="imageSource"]:checked')?.value || ImageSource.PICSUM

  if (formValues.imageSource === ImageSource.PICSUM) {
    formValues.imageUrl = form.querySelector('[name="imageUrl"]')?.value || ''
  } else {
    formValues.image = form.querySelector('[name="image"]')?.files?.[0]
  }

  return formValues
}

function setHeroImage(imageUrl) {
  const heroImage = document.getElementById('postHeroImage')
  if (heroImage && imageUrl) heroImage.style.backgroundImage = `url("${imageUrl}")`
}

function setFormValues(form, values) {
  setFieldValue(form, '[name="title"]', values.title)
  setFieldValue(form, '[name="author"]', values.author)
  setFieldValue(form, '[name="description"]', values.description)

  setFieldValue(form, '[name="imageUrl"]', values.imageUrl)
  setHeroImage(values.imageUrl)
}

function retrieveErrorMessage(error) {
  if (!error || error.name !== 'ValidationError') return ''

  return error.errors?.[0] || ''
}

function setValidationRules(form, schema) {
  ;['title', 'author', 'description'].forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`)
    if (!field) return

    field.addEventListener('blur', async (event) => {
      try {
        const value = event.target.value
        await schema.validateAt(name, { [name]: value })
        event.target.classList.remove('is-invalid')
      } catch (error) {
        // only gets here if it has validation error
        // then mark it as error and show the error message
        event.target.classList.add('is-invalid')
        const errorElement = event.target.parentElement.querySelector('.invalid-feedback')
        if (errorElement) errorElement.textContent = retrieveErrorMessage(error)
      }
    })
  })
}

function showValidationErrors(form, values, schema) {
  ;['title', 'author', 'description', 'image', 'imageUrl'].forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`)
    if (!field) return

    try {
      const value = values[name]
      schema.validateSyncAt(name, { imageSource: values.imageSource, [name]: value })
      field.classList.remove('is-invalid')
    } catch (error) {
      // only gets here if it has validation error
      // then mark it as error and show the error message
      field.classList.add('is-invalid')
      const errorElement = field.parentElement.querySelector('.invalid-feedback')
      if (errorElement) errorElement.textContent = retrieveErrorMessage(error)
    }
  })
}

function renderUploadType(form, type) {
  const uploadTypeList = form.querySelectorAll('[data-id="imageSource"]')
  uploadTypeList.forEach((uploadType) => {
    uploadType.hidden = type !== uploadType.dataset.imageSource
  })
}

function initRandomImageButton(form) {
  const randomImageButton = form.querySelector('[data-id="randomImage"]')
  if (!randomImageButton) return

  randomImageButton.addEventListener('click', () => {
    const randomImageUrl = `https://picsum.photos/id/${randomNumberInRange(10, 500)}/1378/400`
    setHeroImage(randomImageUrl)
    setFieldValue(form, '[name="imageUrl"]', randomImageUrl)
  })
}

function initImageSourceRadio(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]')
  radioList.forEach((radio) => {
    radio.addEventListener('change', (event) => renderUploadType(form, event.target.value))
  })
}

function initUploadImageInput(form) {
  const uploadImageInput = form.querySelector('[name="image"]')
  if (!uploadImageInput) return

  uploadImageInput.addEventListener('change', async (event) => {
    try {
      const image = event.target.files[0]
      await getFormSchema().validateAt('image', { imageSource: 'upload', image })
      event.target.classList.remove('is-invalid')
    } catch (error) {
      // only gets here if it has validation error
      // then mark it as error and show the error message
      console.log(error)
      event.target.classList.add('is-invalid')
      const errorElement = event.target.parentElement.querySelector('.invalid-feedback')
      if (errorElement) errorElement.textContent = retrieveErrorMessage(error)
    }
  })
}

function initUploadImageControl(form) {
  initRandomImageButton(form)
  initImageSourceRadio(form)
  initUploadImageInput(form)
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  initUploadImageControl(form)

  // set initial values
  setFormValues(form, defaultValues)

  // trigger validation on blur
  const formSchema = getFormSchema()
  setValidationRules(form, formSchema)

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    // get form values
    const formValues = getFormValues(form)
    console.log({ formValues })

    if (defaultValues.id) formValues.id = defaultValues.id

    const isValid = await formSchema.isValid(formValues)
    console.log('form valid', isValid)
    if (!isValid) {
      showValidationErrors(form, formValues, formSchema)
      return
    }

    // trigger submission
    onSubmit?.(formValues)
  })
}
