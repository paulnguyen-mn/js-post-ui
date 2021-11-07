import { setBackgroundImage, setTextContent } from '.'
import { setFieldValue } from './common'

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title)
  setFieldValue(form, '[name="author"]', formValues?.author)
  setFieldValue(form, '[name="description"]', formValues?.description)

  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl) // hidden field
  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl)
}

function getFormValues(form) {
  const formValues = {}

  // S1: query each input and add to values object
  // ;['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //   const field = form.querySelector(`[name="${name}"]`)
  //   if (field) formValues[name] = field.value
  // })

  // S2: using form data
  const data = new FormData(form)
  for (const [key, value] of data) {
    formValues[key] = value
  }

  return formValues
}

function getTitleError(form) {
  const titleElement = form.querySelector('[name="title"]')
  if (!titleElement) return

  // required
  if (titleElement.validity.valueMissing) return 'Please enter title.'

  // at least two words
  if (titleElement.value.split(' ').filter((x) => !!x && x.length >= 3).length < 2) {
    return 'Please enter at least two words of 3 characters'
  }

  return ''
}

function validatePostForm(form, formValues) {
  // get errors
  const errors = {
    title: getTitleError(form),
    // author: getAuthorError(form)
    // ...
  }

  // set errors
  for (const key in errors) {
    const element = form.querySelector(`[name="${key}"]`)
    if (element) {
      element.setCustomValidity(errors[key])
      setTextContent(element.parentElement, '.invalid-feedback', errors[key])
    }
  }

  // add was-validated class to form element
  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')
  return isValid
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  setFormValues(form, defaultValues)

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    console.log('submit form')

    // get form values
    const formValues = getFormValues(form)
    console.log(formValues)

    // validation
    // if valid trigger submit callback
    // otherwise, show validation errors
    if (!validatePostForm(form, formValues)) return
  })
}
