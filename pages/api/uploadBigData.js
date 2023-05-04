import multiparty from 'multiparty'
import util from 'util'
import multer from 'multer'

// https://nextjs.org/docs/api-routes/request-helpers
// 可以针对指定的请求，设置文件大小
export const config = {
  api: {
    // 如果想自己处理请求体，可以置为false，然后使用一些专门的库来处理
    // bodyParser: false,
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

/* eslint-disable import/no-anonymous-default-export */
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
    // const form = new multiparty.Form()
    // await new Promise((resolve, rej) => {
    //   form.parse(req, (err, fields, files) => {
    //     // console.log('djch form.parse', err, fields, files)

    //     if (err) {
    //       console.error('djch err', err)
    //       res.status(500).send({ message: '服务器解析formData失败', err })
    //       return
    //     }
    //     // files 参数保存了 formData 中文件，fields 参数保存了 formData 中非文件的字段
    //     console.log('djch ', fields)
    //     // 如何保证顺序？前端是串行发送的，如何保证顺序，可以保存在对象里
    //     // 服务端声明的临时变量，怎么办？
    //     // const { curChunk, chunk,  } = fields

    //     res.writeHead(200, { 'content-type': 'text/plain' });
    //     res.write('received upload: \n\n');
    //     res.end(util.inspect({ fields: fields, files: files }));

    //     resolve()
    //     return res.status(200).send({ message: '服务器已收到文件' });
    //   })
    // })
    return res.status(200).send({ message: '服务器已收到文件' })
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() })
  }
}
