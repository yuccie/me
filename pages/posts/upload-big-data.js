/**
 * 大文件断点上传
 * 1. 前端使用XMLHttpRequest上传文件，
 */
import { useState } from 'react'
import { Upload } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
const { Dragger } = Upload

/* eslint-disable import/no-anonymous-default-export */
export default function UploadBigData() {
  const [fileList, setFileList] = useState([])

  const props = {
    fileList,
    name: 'file',
    multiple: false,
    customRequest({ file, onSuccess, onProgress, onError }) {
      const formData = new FormData()
      formData.append('file', file)

      const xhr = new XMLHttpRequest()
      xhr.open('post', '/api/uploadBigData')
      // 浏览器会自动根据数据格式，添加content-type
      // xhr.setRequestHeader('Content-Type', 'multipart/form-data')
      xhr.onload = (evt) => {
        if (xhr.status === 200) {
          console.log('djch 上传完成后，才会进入回调')
          // 断点调试可知，onSuccess 回调里会修改file的status、process、response等等
          // 从而改变props里的 fileList，从而让菊花转消失
          onSuccess(null, file)
        } else {
          console.error(xhr.response)
        }
      }
      // 上传进度
      xhr.upload.onprogress = function (event) {
        console.log(`djch 先触发 Uploaded ${event.loaded} of ${event.total} bytes`)
      }

      // 上传完成
      xhr.upload.onload = function () {
        console.log(`djch 然后触发`)
      }

      // 跟踪完成：无论成功与否
      xhr.onloadend = function () {
        if (xhr.status == 200) {
          console.log('djch 最后会走到这里')
        } else {
          console.log('error ' + this.status)
        }
      }
      // const res = fetch('/api/uploadBigData', {
      //     method: 'post',
      //     body: formData,
      // }).then(res => {
      //     console.log('djch res', res)
      // }).catch(err => {
      //     console.log('djch err', err)
      // })
      xhr.send(formData)
    },
    onChange({ fileList }) {
      // 当文件变化以及状态变化，都会触发
      setFileList(fileList)
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
