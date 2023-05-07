import multiparty from 'multiparty'
import util from 'util'
import multer from 'multer'
import fs from 'fs'

// https://nextjs.org/docs/api-routes/request-helpers
// 可以针对指定的请求，设置文件大小
export const config = {
  api: {
    // 如果想自己处理请求体，可以置为false，然后使用一些专门的库来处理
    bodyParser: false,
    // bodyParser: {
    //   sizeLimit: '10mb',
    // },
  },
}

/* eslint-disable import/no-anonymous-default-export */
// export default async (req, res) => {
//   try {
//     console.log('djch rawHeaders', typeof req.body)

//     fs.writeFileSync('./temp.pdf', req.body)
//     // 接收到文件，判断数据类型，若为文件，则放到本地
//     // multer({ dest: './temp/' })

//     return res.status(200).send({ message: '服务器已收到文件' })
//   } catch (error) {
//     return res.status(500).json({ error: error.message || error.toString() })
//   }
// }

export default async (req, res) => {
  try {
    console.log('djch rawHeaders', typeof req.body)

    // util + multer 方案
    // await util.promisify(multer().any())(req, res);
    // console.log("req.body", req.body); // >> req.body [Object: null prototype] {}
    // console.log("req.files", req.files); // >> req.files []
    // // Do the file upload to S3...
    // res.status(200).json({ uploadData });

    // multiparty 方案
    const form = new multiparty.Form()
    await new Promise((resolve, rej) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('djch err', err)
          res.status(500).send({ message: '服务器解析formData失败', err })
          return
        }
        // files 参数保存了 formData 中文件，fields 参数保存了 formData 中非文件的字段
        const file = files.file[0]
        const tempFilePath = file.path
        console.log('djch 服务器接收到文件存放的临时目录为：', tempFilePath)
        const filename = file.originalFilename
        const path = `${__dirname}/${filename}`

        // 方式一：从临时文件目录里读取，并写到新的目录里
        // fs.writeFileSync(path, fs.readFileSync(file.path))

        // 方式二：还可以直接将临时文件，移动到目标目录
        // fs.rename(file.path, path, (err) => {
        //   if (err) console.log('移动失败', err)
        //   console.log('文件移动成功')
        // })

        // 方式三：还可以使用promise方式
        await fs.promises.rename(file.path, path)
        console.log('串行移动成功')
        return res.status(200).send({ message: '服务器已收到文件' })
      })
    })
    return res.status(200).send({ message: '服务器已收到文件' })
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() })
  }
}
