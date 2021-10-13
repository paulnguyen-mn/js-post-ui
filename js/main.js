import axiosClient from './api/axiosClient'

console.log('hello from main.js')

async function main() {
  // const response = await axiosClient.get('/posts')
  const response = await axiosClient.get('/posts')
  console.log(response)
}

main()
