import axiosClient from './api/axiosClient'
import postApi from './api/postApi'

console.log('hello from main.js')

async function main() {
  // const response = await axiosClient.get('/posts')
  // const response = await axiosClient.get('/posts')
  try {
    const queryParams = {
      _page: 1,
      _limit: 5,
    }
    const response = await postApi.getAll(queryParams)
    console.log(response)
  } catch (error) {}

  await postApi.updateFormData({
    id: 'sktwi1cgkkuif36do',
    title: 'Adipisci a enim 444',
  })
}

main()
