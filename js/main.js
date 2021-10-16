import postApi from './api/postApi'

async function main() {
  try {
    const queryParams = {
      _page: 1,
      _limit: 5,
    }
    const data = await postApi.getAll(queryParams)
    console.log('main.js data', data)

    // getAllCities()
  } catch (error) {
    console.log('get all failed', error)
    // show modal, toast error
  }

  await postApi.updateFormData({
    id: 'sktwi1cgkkuif36do',
    title: 'Adipisci a enim 444',
  })
}

main()
