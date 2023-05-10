import {
  MenuFoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { Button, Layout, Menu, theme } from 'antd'
import { useState, useEffect } from 'react'
const { Header, Sider, Content } = Layout

const BeautifulJs = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [curMenu, setCurMenu] = useState('')
  const [bodyMap, setBodyMap] = useState({})
  const [bodyKey, setBodyKey] = useState('promiseLimitStr')

  // const {
  //     token: { colorBgContainer },
  // } = theme.useToken();

  const clickMenu = (evt) => {
    // console.log('djch evt', evt)
    // const { key: menuKey } = evt
    // setCurMenu(evt.key)
    setBodyKey(`${evt.key}Str`)
  }

  // 解决问题思路
  // 题套路
  // bodyMap.twoSumStr = () => {
  //   // return `

  //   // `
  // }

  // promiseLimit
  bodyMap.promiseLimitStr = () => {
    return `
    // 💥❌❗️❓
    const promiseLimit = (ps, limit) => {
      return new Promise((resolve, reject) => {
        let running = 0
        let idx = 0
        let results = []

        const runTask = (task) => {
          running++
          console.log('djch 正在运行中数量', running)
          task()
            .then((res) => {
              running--
              results.push(res)
              walk()
            })
            .catch((err) => reject(err))
        }

        const walk = () => {
          while (running < limit && idx < ps.length) {
            runTask(ps[idx])
            idx++
          }
          if (!running) {
            resolve(results)
          }
        }

        walk()
      })
    }

    const tasks = [
      () => new Promise((resolve) => setTimeout(() => resolve(1), 1000)),
      () => new Promise((resolve) => setTimeout(() => resolve(2), 2000)),
      () => new Promise((resolve) => setTimeout(() => resolve(3), 3000)),
      () => new Promise((resolve) => setTimeout(() => resolve(4), 4000)),
      () => new Promise((resolve) => setTimeout(() => resolve(5), 5000)),
      () => new Promise((resolve) => setTimeout(() => resolve(6), 6000)),
    ]

    promiseLimit(tasks, 2)
      .then((results) => {
        console.log(results)
      })
      .catch((error) => {
        console.error(error)
      })
    `
  }

  // promiseAll
  bodyMap.promiseAllStr = () => {
    // 下面一行勿动 🚫
    return `
    // --------promiseAllV1--------------------------------------------------------------------------------------------------------
    const promiseAllV1 = ps => {
      return new Promise((resolve, reject) => {
        let count = 0
        let results = []
        const len = ps.length

        for (let i = 0; i < len; i++) {
          // 要求传入的promise列表，每个都是promise
          ps[i].then(res => {
            count++
            results.push(res)

            if (count === len) {
              resolve(results)
            }
          }).catch(err => {
            reject(err)
          })
        }
      })
    }
    const tasksV1 = [
      Promise.resolve(1),
      Promise.resolve(3)
    ]
    // 以下几种操作方式都不对
    // console.log('promiseAllV1结果：', promiseAllV1(tasksV1))     // ❌ promiseAllV1是一个promise，需要.then调用才能拿到结果
    // const resV1 = promiseAllV1(tasksV1).then(res => res)        // ❌ 这个res并不会返回，因此resV1拿到的只是一个新的Promise
    // console.log('promiseAllV1结果：', resV1)                     // ❌ 打印：Promise {<pending>}
    promiseAllV1(tasksV1).then(res => console.log('promiseAllV1结果：', res))  // ✅ [1, 3]
    // --------promiseAllV1--end------------------------------------------------------------------------------------------------------


    // --------promiseAllV2--------------------------------------------------------------------------------------------------------
    const promiseAllV2 = (ps) => {
      return new Promise((resolve, reject) => {
        let results = []
        let count = 0
        const len = ps.length

        for (let i = 0; i < len; i++) {
          // 🔥 这里兼容了非promise得情况
          Promise.resolve(ps[i]).then(res => {
            // 🔥 因此这里需要处理下：
            results.push(typeof res === 'function' ? res() : res)
            count++
            if (count === len) {
              resolve(results)
            }
          }).catch(err => reject(err))
        }
      })
    }
    const tasksV2 = [
      () => 1,                        // 🔥 可以直接拿到1
      Promise.resolve(3),
      4,
      setTimeout(() => 'setTimeout')  // ❌ 这里并不会讲setTimout字符串返回，因为promise处理的是外层 setTimeout的返回值，返回一个定时器id
    ]
    promiseAllV2(tasksV2).then(res => console.log('promiseAllV2结果：', res))  // ✅ [1, 3, 4, 一个定时器id]
    // --------promiseAllV2--end------------------------------------------------------------------------------------------------------


    // --------promiseAllV3--------------------------------------------------------------------------------------------------------
    const promiseAllV3 = (ps) => {
      return new Promise((resolve, reject) => {
        let results = []
        let count = 0
        let errors = []
        const len = ps.length

        for (let i = 0; i < len; i++) {
          Promise.resolve(ps[i]).then(res => {
            results.push(typeof res === 'function' ? res() : res)
            count++
            // console.log('success', Date.now())  // 💥 不管error在什么时候抛出，都是最后走到catch里
            if (count === len) {
              // 🔥 
              resolve([...results, ...errors])
            }
          }).catch(err => {
            // 🔥 为了让程序不直接reject，则需要将错误存放
            count++
            // console.log('error', Date.now())
            errors.push(err)
            // 🔥 当异常发生时，不会再进入then里，因此这里需要判断 是否结束
            if (count === len) {
              resolve([...results, ...errors])
            }
          })
        }
      })
    }
    const tasksV3 = [
      Promise.reject('error'),  // 🔥 抛出一个错误
      () => 1,
      Promise.resolve(3),
      setTimeout(() => 'setTimeout')
    ]

    promiseAllV3(tasksV3).then(res => console.log('promiseAllV3结果：', res))  // ❌ [1, 3, 定时器id, 'error'] 顺序不对
    // --------promiseAllV3--end------------------------------------------------------------------------------------------------------

    // --------promiseAllV3--------------------------------------------------------------------------------------------------------
    const promiseAllV4 = (ps) => {
      return new Promise((resolve, reject) => {
        let results = []
        let count = 0
        let errors = []
        const len = ps.length

        for (let i = 0; i < len; i++) {
          Promise.resolve(ps[i]).then(res => {
            // 🔥 必须根据顺序存放
            results[i] = typeof res === 'function' ? res() : res
            count++

            if (count === len) {
              resolve(results)
            }
          }).catch(err => {
            count++
            // 🔥 必须根据顺序存放
            results[i] = err
            if (count === len) {
              resolve(results)
            }
          })
        }
      })
    }
    const tasksV4 = [
      Promise.reject('error'),     // 🔥 抛出一个错误
      () => 1,
      Promise.resolve(3),
      setTimeout(() => 'setTimeout'),
    ]

    promiseAllV4(tasksV4).then(res => console.log('promiseAllV4结果：', res))  // ✅ ['error', 1, 3, 一个定时器id] 
    // --------promiseAllV3--end------------------------------------------------------------------------------------------------------

    // 总结：
    // 1、promise 列表里，按理说每一项都需要是一个Promise才行，就比如 Promise.resolve(3)
    // 2、如果不为promise，可以是一个函数，比如：() => 1, 目前处理这种case
    // 3、setTimeout(() => 'setTimeout') 这种暂时处理不了，需要变量接收才行
    // 4、如果再嵌套多层函数的话，则需要另外处理，比如：() => Promise.resolve('更深一层') 就没有处理，会返回一个 Promise

    // 下面一行勿动 🚫
    `
  }

  bodyMap.twoSumStr = () => {
    // 下面一行勿动 🚫
    return `
    const twoSum = (nums, target) => {
      const map = new Map()
      const len = nums.length

      for(let i = 0; i < len; i++) {
        // 哨兵
        const rest = target - nums[i]

        // 💥 目前正在遍历 nums[i]，而 map里有rest，也就是 target - nums[i]
        // 💥 这不是正好相等吗
        if (map.has(rest)) {
          return [map.get(rest), i]
        }

        // 💥 如何没有，则将遍历的值存储下来
        map.set(nums[i], i)
      }
      return '没有这样的两个数字'
    }

    let nums = [2, 7, 11, 15];
    let target = 9;
    let result = twoSum(nums, target);
    console.log('两数之和：', result); // [0, 1]
    
    // 下面一行勿动 🚫
    `
  }

  bodyMap.LRUStr = () => {
    return `
    const lruCache = (maxSize) => {
      const map = new Map()
      const maxSize = maxSize

      return {
        get(key) {
          if (map.has(key)) {
            const val = map.get(key)
            map.delete(key)
            // 更新
            map.set(key, val)
            return val
          }
          return -1
        },
        put(key, val) {
          if (map.has(key)) {
            map.delete(key)
          }
          map.set(key, val)
          
          // 设置完数据，需要检查大小
          if (map.size > maxSize) {
            // 找到最开始那一个并删除，Map是可迭代对象
            // 💥 之所以是第一个，因为 map.keys() 返回的是最开始的可迭代对象，调用next获取的就是迭代第一次的值啊。。。
            const firstKey = map.keys().next().value
            map.delete(firstKey)
          }
        },
        keys() {
          return map.keys()
        }
      }
    }
    const cache = lruCache(2)

    cache.put("a", 1)
    cache.put("b", 2)
    cache.put("c", 3)           // 操作完这个 a 将会消失
    console.log(cache.get('a')) // 输出 -1
    // 💥 注意观察下面返回的可迭代对象，.next()，第一次迭代，就是第一个了
    console.log(cache.keys())   // 输出可迭代对象 MapIterator {'b', 'c'}
    // 0 : "b"
    // 1 : "c"

    // 下面一行勿动 🚫
    `
  }

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          onClick={clickMenu}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: 'promise',
              icon: <UserOutlined />,
              label: 'Promise',
              children: [
                {
                  key: 'promiseAll',
                  icon: <VideoCameraOutlined />,
                  label: 'promiseAll',
                },
                {
                  key: 'promiseLimit',
                  icon: <UploadOutlined />,
                  label: 'promiseLimit',
                },
              ],
            },
            {
              key: 'map',
              icon: <UserOutlined />,
              label: 'Map',
              children: [
                {
                  key: 'twoSum',
                  icon: <VideoCameraOutlined />,
                  label: 'twoSum',
                },
                {
                  key: 'LRU',
                  icon: <VideoCameraOutlined />,
                  label: 'LRU',
                },
              ],
            },
            {
              key: 'lianbiao',
              icon: <VideoCameraOutlined />,
              label: '链表相关',
            },
            {
              key: 'array',
              icon: <UploadOutlined />,
              label: '数组相关',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            // background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            // background: colorBgContainer,
          }}
        >
          <SyntaxHighlighter showLineNumbers language="javascript">
            {bodyMap[bodyKey]()}
            {/* {promiseLimit.toString()} */}
          </SyntaxHighlighter>
        </Content>
      </Layout>
    </Layout>
  )
}
export default BeautifulJs
