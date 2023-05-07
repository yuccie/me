/**
 * 大文件断点上传
 * 1. 前端使用XMLHttpRequest上传文件，
 */
import { useState } from 'react'
import styled, { css } from 'styled-components'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Upload, Button, Space, Card, List } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
const { Dragger } = Upload

const ActionType = styled.h3`
  padding: 5px;
  color: #1677ff;
  background: rgba(22, 119, 255, 0.1);
  border-radius: 5px;
`

const ResourceLink = styled.a`
  color: #1677ff;
  margin-top: 10px;
  display: inline-block;
`

const Btn = styled(({ active, ...props }) => <Button {...props} />)`
  ${({ active }) =>
    active &&
    css`
      color: #1677ff;
      border: 1px solid #1677ff;
    `}
`

const XMLHttpRequestDataList = [
  '1、XMLHttpRequest是早期的API，使用回调函数',
  '2、XMLHttpRequest默认会发送和接收cookies',
  '3、XMLHttpRequest无法获取可读流，只能获取完整的响应',
  '4、XMLHttpRequest需要判断状态码和readyState属性，来判断是否成功',
  '5、XMLHttpRequest需要设置withCredentials为true才能进行跨域请求',
]

const fetchDataList = [
  '1、fetch是ES6新增的API，使用Promise',
  '2、fetch默认不会发送或接收cookies，需要设置credentials为"include"才能发送cookies',
  '3、fetch支持流式传输，可以使用response.body.getReader()方法获取响应的可读流',
  '4、fetch对于错误的处理更加简单，只需在catch中处理即可',
  '5、fetch支持跨域请求，但需要服务器设置CORS',
]

// 想使用带有变量的模版字符串，需要将变量转义才可以
const xhrCodeString = `
const formData = new FormData()
formData.append('file', file)

// 创建请求
const xhr = new XMLHttpRequest()

// xhr.open(method, URL, [async, user, password])
// 初始化请求，参数三若显式设置 false 则是同步请求
xhr.open('post', '/api/uploadBigData')

// 浏览器会自动根据数据格式，自动添加content-type，视情况而定
// xhr.setRequestHeader('Content-Type', 'multipart/form-data')
// xhr.setRequestHeader('X-Auth', '123');
// xhr.setRequestHeader('X-Auth', '456');
// 一旦设置了 header，就无法撤销了。其他调用会向 header 中添加信息，也不会覆盖它。
// header：X-Auth: 123, 456

// 默认情况下不会将 cookie 和 HTTP 授权发送到其他域
xhr.withCredentials = false;

// timeout 单位是 ms，此处即 10 秒 ，若超时，就会进入 timeout 回调
xhr.timeout = 20 * 1000; 

// 设置响应格式：
// ""（默认）—— 响应格式为字符串，
// "text" —— 响应格式为字符串，
// "arraybuffer" —— 响应格式为 ArrayBuffer（对于二进制数据，请参见 ArrayBuffer，二进制数组），
// "blob" —— 响应格式为 Blob（对于二进制数据，请参见 Blob），
// "document" —— 响应格式为 XML document（可以使用 XPath 和其他 XML 方法）或 HTML document（基于接收数据的 MIME 类型）
// "json" —— 响应格式为 JSON（自动解析）
// xhr.responseType = 'json';

// 发送请求, 它几乎可以发送任何 body，包括 Blob 和 BufferSource 对象。
xhr.send(formData)

// 仅在响应阶段触发。
xhr.onprogress = event => {
  // event.loaded —— 已经下载了多少字节
  // event.lengthComputable = true，当服务器发送了 Content-Length header 时
  // event.total —— 总字节数（如果 lengthComputable 为 true）
  if (event.lengthComputable) {
    console.log('djch 接收响应中 ' + event.loaded + ' of ' + event.total + ' bytes');
  } else {
    console.log('djch 接收响应中 ' + event.loaded + ' bytes'); // 响应没有设置 Content-Length
  }
}

// 当请求完成（即使 HTTP 状态为 400 或 500 等），并且响应已完全下载，将调用此函数
xhr.onload = (evt) => {
  if (xhr.status === 200) {
    console.log('djch 响应已完全下载，才会进入回调')

    // console.log('djch 获取指定响应头', xhr.getResponseHeader('Content-Type'))
    // console.log('djch 返回除 Set-Cookie 和 Set-Cookie2 外的所有 response header：', xhr.getAllResponseHeaders())
    // 解析响应头
    // let headers = xhr
    //   .getAllResponseHeaders()
    //   .split('\\r\\n')
    //   .reduce((result, current) => {
    //     let [name, value] = current.split(': ');
    //     result[name] = value;
    //     return result;
    //   }, {});

    // statusText：状态码为 200 对应于 OK，404 对应于 Not Found，403 对应于 Forbidden。
    console.log('djch 响应码：响应文案 ' + xhr.status + ': ' + xhr.statusText); // 例如 404: Not Found

    // 断点调试可知，onSuccess 回调里会修改file的status、process、response等等
    // 从而改变props里的 fileList，从而让菊花转消失
    onSuccess(null, file)
  } else {
    console.error(xhr.response)
  }
}

// 响应完成：无论成功与否，相当于finally
xhr.onloadend = function () {
  if (xhr.status == 200) {
    console.log('djch 响应完成 finally，响应码为：', this.status)
  } else {
    console.log('djch 响应完成, 状态码为：' + this.status)
  }
}

// 当无法发出请求，例如网络中断或者无效的 URL。
xhr.onerror = err => {
  console.log('djch 无法发出请求')
}

// 如果想观察上传进度，则需要用如下
// xhr.upload 是一个getter，不能直接赋值对象
xhr.upload.loadstart = (evt) => {
  console.log('djch 上传开始')
}
xhr.upload.onprogress = (evt) => {
  // 上传期间定期触发
  // onProgress的参数就是文件对象，然后内部会从event上获取上传的进度，进而展示
  console.log('djch 上传中 Uploaded ' + evt.loaded + ' of ' + evt.total + ' bytes')
  onProgress(evt)
}
xhr.upload.onload = (evt) => {
  console.log('djch 上传成功完成')
}
xhr.upload.ontimeout = (evt) => {
  onError(evt)
  console.log('djch 上传超时')
}
xhr.upload.onabort = (evt) => {
  console.log('djch 上传终止')
}
xhr.upload.onloadend = (evt) => {
  console.log('djch 上传结束，无论成功或失败')
}
xhr.upload.onerror = (evt) => {
  console.log('djch 上传失败，非HTTP错误')
}

// 终止请求 且 xhr.status 变为 0。
// xhr.abort(); 

// 注意：
// 1、如果文件上传很快，上传的日志就不打印。。
// error，abort，timeout 和 load 事件是互斥的。其中只有一种可能发生。
`

const fetchCodeString = `
// 方案二，在不考虑进度时，可以使用fetch来实现文件上传
let response = await fetch('/api/uploadBigData');

if (response.ok) { // 如果 HTTP 状态码为 200-299
  // 获取 response body（此方法会在下面解释）
  onSuccess(null, file)
  let json = await response.json();
} else {
  onError(null, file)
  alert("HTTP-Error: " + response.status);
}

`

/* eslint-disable import/no-anonymous-default-export */
export default function UploadBigData() {
  const [fileList, setFileList] = useState([])
  const [curType, setCurType] = useState('XMLHttpRequest')
  const [curResourceLink, setResourceLink] = useState('https://zh.javascript.info/fetch')
  const finalDataList = curType === 'XMLHttpRequest' ? XMLHttpRequestDataList : fetchDataList
  const finalCodeString = curType === 'XMLHttpRequest' ? xhrCodeString : fetchCodeString

  const props = {
    fileList,
    name: 'file',
    multiple: false,
    customRequest: async ({ file, onSuccess, onProgress, onError }) => {
      const formData = new FormData()
      formData.append('file', file)
      //
      if (curType === 'XMLHttpRequest') {
        // 创建请求
        const xhr = new XMLHttpRequest()

        // xhr.open(method, URL, [async, user, password])
        // 初始化请求，参数三若显式设置 false 则是同步请求
        xhr.open('post', '/api/uploadBigData')

        // 浏览器会自动根据数据格式，自动添加content-type，视情况而定
        // xhr.setRequestHeader('Content-Type', 'multipart/form-data')
        // xhr.setRequestHeader('X-Auth', '123');
        // xhr.setRequestHeader('X-Auth', '456');
        // 一旦设置了 header，就无法撤销了。其他调用会向 header 中添加信息，也不会覆盖它。
        // header：X-Auth: 123, 456

        // 默认情况下不会将 cookie 和 HTTP 授权发送到其他域
        xhr.withCredentials = false

        // timeout 单位是 ms，此处即 10 秒 ，若超时，就会进入 timeout 回调
        xhr.timeout = 20 * 1000

        // 设置响应格式：
        // ""（默认）—— 响应格式为字符串，
        // "text" —— 响应格式为字符串，
        // "arraybuffer" —— 响应格式为 ArrayBuffer（对于二进制数据，请参见 ArrayBuffer，二进制数组），
        // "blob" —— 响应格式为 Blob（对于二进制数据，请参见 Blob），
        // "document" —— 响应格式为 XML document（可以使用 XPath 和其他 XML 方法）或 HTML document（基于接收数据的 MIME 类型）
        // "json" —— 响应格式为 JSON（自动解析）
        // xhr.responseType = 'json';

        // 发送请求, 它几乎可以发送任何 body，包括 Blob 和 BufferSource 对象。
        xhr.send(formData)

        // 仅在响应阶段触发。
        xhr.onprogress = (event) => {
          // event.loaded —— 已经下载了多少字节
          // event.lengthComputable = true，当服务器发送了 Content-Length header 时
          // event.total —— 总字节数（如果 lengthComputable 为 true）
          if (event.lengthComputable) {
            console.log('djch 接收响应中 ' + event.loaded + ' of ' + event.total + ' bytes')
          } else {
            console.log('djch 接收响应中 ' + event.loaded + ' bytes') // 响应没有设置 Content-Length
          }
        }

        // 当请求完成（即使 HTTP 状态为 400 或 500 等），并且响应已完全下载，将调用此函数
        xhr.onload = (evt) => {
          if (xhr.status === 200) {
            console.log('djch 响应已完全下载，才会进入回调')

            // console.log('djch 获取指定响应头', xhr.getResponseHeader('Content-Type'))
            // console.log('djch 返回除 Set-Cookie 和 Set-Cookie2 外的所有 response header：', xhr.getAllResponseHeaders())
            // 解析响应头
            // let headers = xhr
            //   .getAllResponseHeaders()
            //   .split('\r\n')
            //   .reduce((result, current) => {
            //     let [name, value] = current.split(': ');
            //     result[name] = value;
            //     return result;
            //   }, {});

            // statusText：状态码为 200 对应于 OK，404 对应于 Not Found，403 对应于 Forbidden。
            console.log('djch 响应码：响应文案 ' + xhr.status + ': ' + xhr.statusText) // 例如 404: Not Found

            // 断点调试可知，onSuccess 回调里会修改file的status、process、response等等
            // 从而改变props里的 fileList，从而让菊花转消失
            onSuccess(null, file)
          } else {
            console.error(xhr.response)
          }
        }

        // 响应完成：无论成功与否，相当于finally
        xhr.onloadend = function () {
          if (xhr.status == 200) {
            console.log('djch 响应完成 finally，响应码为：', this.status)
          } else {
            console.log('djch 响应完成, 状态码为：' + this.status)
          }
        }

        // 当无法发出请求，例如网络中断或者无效的 URL。
        xhr.onerror = (err) => {
          console.log('djch 无法发出请求')
        }

        // 如果想观察上传进度，则需要用如下
        // xhr.upload 是一个getter，不能直接赋值对象
        xhr.upload.loadstart = (evt) => {
          console.log('djch 上传开始')
        }
        xhr.upload.onprogress = (evt) => {
          // 上传期间定期触发
          // onProgress的参数就是文件对象，然后内部会从event上获取上传的进度，进而展示
          console.log('djch 上传中 Uploaded ' + evt.loaded + ' of ' + evt.total + ' bytes')
          onProgress(evt)
        }
        xhr.upload.onload = (evt) => {
          console.log('djch 上传成功完成')
        }
        xhr.upload.ontimeout = (evt) => {
          onError(evt)
          console.log('djch 上传超时')
        }
        xhr.upload.onabort = (evt) => {
          console.log('djch 上传终止')
        }
        xhr.upload.onloadend = (evt) => {
          console.log('djch 上传结束，无论成功或失败')
        }
        xhr.upload.onerror = (evt) => {
          console.log('djch 上传失败，非HTTP错误')
        }

        // 终止请求 且 xhr.status 变为 0。
        // xhr.abort();

        // 注意：
        // 1、如果文件上传很快，上传的日志就不打印。。
        // error，abort，timeout 和 load 事件是互斥的。其中只有一种可能发生。
      } else if (curType === 'Fetch') {
        // 方案二，在不考虑进度时，可以使用fetch来实现文件上传
        let response = await fetch('/api/uploadBigData', {
          method: 'post',
          body: formData,
        })

        console.log('djch fetch response', response)
        if (response.ok) {
          // 如果 HTTP 状态码为 200-299
          // 获取 response body（此方法会在下面解释）
          onSuccess(null, file)
          let json = await response.json()
          console.log('djch fetch response json', json)
        } else {
          onError(null, file)
          alert('HTTP-Error: ' + response.status)
        }
      }
    },
    onChange({ fileList }) {
      // 当文件变化以及状态变化，都会触发
      setFileList(fileList)
    },
  }

  const btnsClick = (evt) => {
    const { innerText } = evt.target || {}
    switch (innerText) {
      case 'XMLHttpRequest':
        setCurType('XMLHttpRequest')
        setResourceLink('https://zh.javascript.info/xmlhttprequest')
        break
      case 'Fetch':
        setCurType('Fetch')
        setResourceLink('https://zh.javascript.info/fetch')
        break
    }
  }

  return (
    <>
      <Card title="示例： 上传文件">
        <ActionType>描述： 使用不同的方式上传</ActionType>
        <Space style={{ margin: '10px 0' }} onClick={btnsClick}>
          {/* tailwind 的样式覆盖了，后续再调整 */}
          {/* <Button type="primary">Primary Button</Button> */}
          {/* 通过事件代理，获取data-xxx，拿不到 */}
          <Btn active={curType === 'XMLHttpRequest'}>XMLHttpRequest</Btn>
          <Btn active={curType === 'Fetch'}>Fetch</Btn>
        </Space>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖动文件到这里</p>
          <p className="ant-upload-hint">
            {' '}
            支持单个或批量上传。 严禁上传公司数据或其他被禁止的文件{' '}
          </p>
        </Dragger>
      </Card>

      <Card style={{ marginTop: '20px' }} title={`当前请求类型：${curType}`}>
        {/* {curType === 'XMLHttpRequest' ? 'XMLHttpRequest' : 'fetch'} */}

        <List dataSource={finalDataList} renderItem={(item) => <List.Item>{item}</List.Item>} />

        {/* style={dark} 主题引入报错 */}
        <SyntaxHighlighter showLineNumbers language="javascript">
          {finalCodeString}
        </SyntaxHighlighter>

        <ResourceLink target="_blank" href={curResourceLink}>
          点击可查看更多
        </ResourceLink>
      </Card>
    </>
  )
}
