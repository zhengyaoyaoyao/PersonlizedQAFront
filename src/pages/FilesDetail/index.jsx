import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { http } from '../../utils'
const FilesDetail = () => {
  const [params] = useSearchParams()
  const id = params.get('id')
  const [textData, setTextData] = useState()
  useEffect(() => {
    const loadDetail = async () => {
      try {
        const res = await http.get(`/files/info?id=${id}`)
        const url = res.data.data.url

        http
          .get(url)
          .then((response) => {
            setTextData(response.data)
          })
          .catch((error) => {
            console.error('Error fetching file:', error)
          })
      } catch (error) {
        console.error('Error fetching file info:', error)
      }
    }

    loadDetail()
  }, [id])

  return <div>{textData}</div>
}

export default FilesDetail
