/**
 * 大文件断点上传
 * 1. 前端使用XMLHttpRequest上传文件，
 */
import { Upload } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
const { Dragger } = Upload

/* eslint-disable import/no-anonymous-default-export */
export default function UploadBigData() {
  const props = {
    name: 'file',
    // method: 'POST',
    multiple: true,
    // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    // beforeUpload(file, fileList) {
    //     console.log('djch file', file, fileList)
    //     return true
    // },
    customRequest(req) {
      console.log('djch 文件', req.file)
      // const myFile = new File()
      const formData = new FormData()
      formData.append('file', req.file)

      const xhr = new XMLHttpRequest()
      xhr.open('post', '/api/uploadBigData')
      // xhr.setRequestHeader('Content-Type', 'multipart/form-data')

      // const formData = new FormData()
      // 这个文件需要分片？怎么分
      // const { chunks, fileChunks } = splitChunks(files?.[0])
      // console.log('djch fileChunks', fileChunks)
      // formData.append('file', files?.[0])
      // formData.append('file', fileChunks[curChunk])
      // formData.append('filename', files.name)
      // formData.append('chunkNumber', chunks)
      // formData.append('curChunk', curChunk)

      // formData.append('file', files?.[0])
      xhr.send(formData)
      xhr.onload = (evt) => {
        if (xhr.status === 200) {
          // setCurChunk(++curChunk)
          // if (curChunk < chunks) {
          // sendFiles()
          // } else {
          //     console.log('上传完成')
          // }
        } else {
          console.error(xhr.response)
        }
      }

      // const res = fetch('/api/upload', {
      //     method: 'post',
      //     body: formData,
      // }).then(res => {
      //     console.log('djch res', res)
      // }).catch(err => {
      //     console.log('djch err', err)
      // })
    },
  }

  return (
    <>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖动文件到这里</p>
        <p className="ant-upload-hint"> 支持单个或批量上传。 严禁上传公司数据或其他被禁止的文件 </p>
      </Dragger>
    </>
  )
}
