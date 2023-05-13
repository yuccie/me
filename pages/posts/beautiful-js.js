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
// 💥 🔥❌❗️❓
const menus = [
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
    children: [
      {
        key: 'cycleLink',
        icon: <VideoCameraOutlined />,
        label: '环形链表',
      },
      {
        key: 'intersectLink',
        icon: <VideoCameraOutlined />,
        label: '相交链表',
      },
    ],
  },
  {
    key: 'binaryTree',
    icon: <UploadOutlined />,
    label: '二叉树相关',
    children: [
      {
        key: 'binaryTreeTraversal',
        icon: <VideoCameraOutlined />,
        label: '三种遍历',
      },
    ],
  },
  {
    key: 'array',
    icon: <UploadOutlined />,
    label: '数组相关',
    children: [
      {
        key: 'arrayDedupliation',
        icon: <VideoCameraOutlined />,
        label: '数组去重',
      },
    ],
  },
  {
    key: 'dynamic',
    icon: <UploadOutlined />,
    label: '动态规划',
    children: [
      {
        key: 'dynamicProgram',
        icon: <VideoCameraOutlined />,
        label: '矩阵解法',
      },
    ],
  },
]

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
  //   // 💥 🔥❌❗️❓
  //   // return `

  //   // `
  // }

  // promise相关
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

  // Map相关
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

  // 链表相关
  // 链表 -- 链表里是否有环，也叫循环链表、环形链表都可以
  bodyMap.cycleLinkStr = () => {
    // 下面一行勿动 🚫
    return `
    const cycleLink = head => {
      // 利用快慢指针
      // ❌ 注意下面的赋值语句❗️❗️❗️ 首先fast = head 是赋值表达式，然后fast的值为head，然后再赋值给slow，但是fast变成全局变量了。。。在浏览器里fast会泄露到全局
      // 在该项目中，会直接报错：caught ReferenceError: fast is not defined
      // let slow = fast = head
      let slow = head
      let fast = head

      while(fast && fast.next) {
        slow = slow.next
        fast = fast.next.next

        if (slow === fast) {
          return true
        }
      }
      return false
    }

    // 创建一个带环的链表
    const node1 = { val: 1 };
    const node2 = { val: 2 };
    const node3 = { val: 3 };
    const node4 = { val: 4 };
    node1.next = node2;
    node2.next = node3;
    node3.next = node4;
    node4.next = node2;

    console.log('当前是否有环形链表：', cycleLink(node1)) 
    // console.log('泄漏到全局的变量，勿用 ❌ ', fast)

    `
    // 上面👆🏻一行勿动 🚫
  }
  // 链表 -- 相交链表
  bodyMap.intersectLinkStr = () => {
    // 下面一行勿动 🚫
    return `
    // 💥 🔥 相交链表与环形链表不同
    // 💥 🔥 环形链表：是指链表中存在一个环，也就是链表的最后一个节点指向链表中的某个节点，形成一个环形结构。
    // 💥 🔥 相交链表：相交链表是指两个链表在某个节点处相交，后面的节点都重合，也就是后面所有的节点都是相同的。但也只是节点地址相同
    // 思路：既然后面的都相同，那就得走到相交的地方，看后续的是否都相同
    // 1、分别遍历两个链表，并分别记录二者的长度
    // 1-1、走到尾部，如果是相交，就必须相同，一次遍历也可以达到一定效果
    // 2、然后在走到二者相交的地方，也就是 longLen - sortLen
    // 3、在分别检查二者的节点地址是否相同
    const intersectLinkError = (head1, head2) => {
      let len1 = 0
      let len2 = 0 
      let tail1 = head1
      let tail2 = head2
      // 步骤一：分别遍历两个链表
      while(tail1 && tail1.next) {
        len1++
        tail1 = tail1.next
      }
      while(tail2 && tail2.next) {
        len2++
        tail2 = tail2.next
      }
      if (tail2 !== tail1) {
        return false
      }

      // 步骤二：走到假想的相交处，只需走长的就行，赶上短的
      // 这里有问题。。。不能用 ❌ 
      if (len1 > len2) {
        for (let i = 0; i < len1 - len2; i++) {
          head1 = head1.next
        }
      } else {
        // ❌ 这里直接 else 也有点小瑕疵，就是二者长度一致的时候，浪费了一点计算
        for (let i = 0; i < len2 - len1; i++) {
          head2 = head2.next
        }
      }

      // 步骤三：遍历剩下的所有， 
      // 这里有问题，即使赶上了，也不一定就必须相同。。。不能用 ❌ 
      while(head1 && head2) {
        if (head1 === head2) {
          head1 = head1.next
          head2 = head2.next
        } else {
          return false
        }
      }
      return true
    }

    // ✅
    const intersectLink = (headA, headB) => {
      let len1 = 0, len2 = 0;
      let tail1 = headA, tail2 = headB;
      while (tail1 && tail1.next) {
        tail1 = tail1.next;
        len1++;
      }
      while (tail2 && tail2.next) {
        tail2 = tail2.next;
        len2++;
      }
      if (tail1 !== tail2) {
        return null;
      }

      // 步骤二：战线拉的长的，赶赶进度
      let cur1 = headA, cur2 = headB;
      if (len1 > len2) {
        for (let i = 0; i < len1 - len2; i++) {
          cur1 = cur1.next;
        }
      } else  {
        for (let i = 0; i < len2 - len1; i++) {
          cur2 = cur2.next;
        }
      }

      // 步骤三：赶完进度后，挨个对比，如果不一样，再继续往后走
      while (cur1 !== cur2) {
        cur1 = cur1.next;
        cur2 = cur2.next;
      }

      // 若相同，则直接返回，二者都可以；如果cur1最后是null那就是不相交
      return cur1;
    }



    // 创建一个带环的链表
    const node1 = { val: 1 };
    const node2 = { val: 2 };
    const node3 = { val: 3 };
    const node4 = { val: 4 };
    node1.next = node2;
    node2.next = node3;
    node3.next = node4;

    const node11 = { val: 1 };
    const node22 = { val: 2 };
    const node33 = { val: 3 };
    const node44 = { val: 4 };
    const node55 = { val: 4 };
    const node66 = { val: 4 };
    node11.next = node22;
    node22.next = node33;
    node33.next = node2;
    node2.next = node3;
    node3.next = node4;

    console.log('当前是否是相交链表：', intersectLink(node1, node11)) 

    `
    // 上面👆🏻一行勿动 🚫
  }

  // 二叉树相关
  // 二叉树 -- 三种遍历
  bodyMap.binaryTreeTraversalStr = () => {
    // 💥 🔥❌❗️❓
    return `
    // 💥 二叉树特点：
    // 1、树状结构，每个节点最多有两个子节点，分别为左、右子节点
    // 2、二叉搜索树，左子节点比根节点小，根节点比右子节点小
    // 3、三种遍历方式：先序（根左右）、中序（左根右）、后序（左右根）
    // 4、💥 🔥 记忆法门，最开始的是先序，而根也在最开始，然后开始移动根 -> 就得到了各种排序
    // 5、二叉树，遍历有递归和迭代，如果深度足够，递归容易堆栈溢出

    const arr1 = []
    const arr2 = []
    const arr3 = []
    // 先序递归：根 -> 遍历所有左树 -> 遍历所有右树
    const recursionPreOrderTraversal = (root) => {
      if (!root) {
        return
      }
      // 💥 🔥 先序，肯定第一个输出的是根，因此先打印
      arr1.push(root.value)
      // 递归遍历所有左树
      recursionPreOrderTraversal(root.left)
      // 递归遍历所有右树
      recursionPreOrderTraversal(root.right)
    }

    // 中序递归：遍历所有左树 -> 根 ->  遍历所有右树
    // 预期：
    const recursionInOrderTraversal = (root) => {
      if (!root) {
        return
      }
      // 递归遍历所有左树
      recursionInOrderTraversal(root.left)
      arr2.push(root.value)
      // 递归遍历所有右树
      recursionInOrderTraversal(root.right)
    }

    // 后序递归：遍历所有左树 -> 遍历所有右树 -> 根 
    const recursionPostOrderTraversal = (root) => {
      if (!root) {
        return
      }
      // 递归遍历所有左树
      recursionPostOrderTraversal(root.left)
      // 递归遍历所有右树
      recursionPostOrderTraversal(root.right)
      arr3.push(root.value)
    }


    // const TreeNode = { // ❌ 不要乱搞额
    class TreeNode {
      constructor(val) {
        this.value = val
        this.left = null
        this.right = null
      }
    }
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(3);
    root.left.left = new TreeNode(4);
    root.left.right = new TreeNode(5);
    // 数据结构如下
    //           1
    //         / \
    //         2   3
    //       / \
    //      4   5

    recursionPreOrderTraversal(root)  
    console.log(arr1)                 // 根左右：1,2,4,5,3
    recursionInOrderTraversal(root)   
    console.log(arr2)                 // 左根右：4,2,5,1,3
    recursionPostOrderTraversal(root) 
    console.log(arr3)                 // 左右根：4,5,2,3,1


    // 迭代方法
    // 使用迭代的话，就需要用到循环，而循环就需要模拟一个数组堆栈，那什么可以呢？
    // 答案是：将待处理的节点，存放到堆栈里，利用数组的自身改变性，循环处理
    const iterationPreOrderTraversal = (root) => {
      // 如果没有节点，则返回空
      if (!root) return []

      const results = []
      const stack = [root]        // 将节点放入堆栈

      while(stack.length) {       // 若堆栈里有节点，则一直处理
        const node = stack.pop()  // 取出节点
        results.push(node.value)  // 先序遍历，则需要立马就存放值
        node.right && stack.push(node.right)   // 前面使用pop，从后面取值，所以最后压入的先处理，而先序需要先处理左侧树
        node.left && stack.push(node.left)
      }
      return results
      // 💥 🔥 先序，肯定第一个输出的是根，因此先打印
    }
    console.log('迭代先序结果：', iterationPreOrderTraversal(root))  // [1,2,4,5,3]

    // ❌中序迭代遍历，如果直接套用上面👆🏻先序的逻辑，则错误 ❌
    const iterationInOrderTraversalError = root => {
      if (!root) return []

      const stacks = [root]
      const results = []

      while(stacks.length) {
        // 中序：左根右
        const node = stacks.pop()
        node.right && stacks.push(node.right)
        results.push(node.value)                // ❌ 仅仅靠移动位置，行不通的
        node.left && stacks.push(node.left)
      }
      return results
    }
    console.log('迭代中序错误结果 ❌，：', iterationInOrderTraversalError(root))  // 该结果依然是先序：[1,2,4,5,3]


    // 因此关键的关键，就是如何构建这个堆栈，💥 🔥 想象一下遍历的最终结果，然后想法按这个顺序把他们从二叉树上拿出来，并放到堆栈里💥 🔥 
    // 数据结构如下
    //          1
    //         / \
    //        2   3
    //       / \
    //      4   5
    const iterationInOrderTraversal = root => {
      if (!root) return []

      const stacks = []   // 左根右 -> 放到堆栈里，就应该是 🔥右根左🔥，因为每次是pop从堆栈取，因此需要先将所有左树全放进去
      const results = []
      let current = root

      while(current || stacks.length) {
        // 当从最底部走上来，此时current为左下角节点的右子树，很明显没有，然后跳过while开始处理 节点 2
        while(current) {
          // 参考数据结构图，当第一次 root的1进来，直接放进去了。。。其实 1 也可以看做是左子节点，想象下2、3 又何尝不是 1 ？
          // 第一次，所以可以直接压入
          stacks.push(current)
          // 然后后续压入的都是左侧节点
          current = current.left
        }

        // 左侧节点压完后，就需要从堆栈里取出，然后遍历
        current = stacks.pop()
        // 第一次时，此时 current 已经在最左下方了，没有子树了，也就是 左根右，没有左了，拿出根的value，然后继续处理右子节点，因为不知道有没有右子节点
        results.push(current.value)    // 🔥 节点里的值，是根据 TreeNode 类确定的，value、val、、什么都行

        // 上面的current，其实就可以理解为根，然后处理右子节点，因为堆栈里没有右子节点的信息，所以需要通过代码走逻辑
        current = current.right
      }
      return results
    }
    console.log('迭代中序结果：', iterationInOrderTraversal(root))  // 结果：[4, 2, 5, 1, 3]

    // 同样道理，后序遍历呢？？？
    // 左右根 -> 因此需要先将所有的左树，右树都先放进去，然后才是处理数据
    const iterationPostOrderTraversalError = root => {
      const results = []
      const stacks = []
      let current = root

      while(current || stacks.length) {
        while(current) {
          stacks.push(current)
          current = current.left
        }

        // 处理完所有左树，再处理右树 
        current = stacks.pop()
        current = current.right    // ❌ 思路不对，因为第一次进来，此时current.right为null，
        while(current) {           // ❌ 想继续通过下面循环，加入右树，是不通的
          stacks.push(current)
          current = current.right
        }
      }
    }

    // 该算法的原理是：利用栈实现二叉树的深度优先遍历，通过lastVisitedNode记录上一个访问的节点，判断当前节点是否可以被访问，从而实现后序遍历。
    // 具体来说，当一个节点的左右子节点都被访问过时，该节点才能被访问。
    // 因此，我们需要在遍历过程中记录上一个访问的节点，以便判断当前节点的右子节点是否已经被访问过。
    // 如果右子节点已经被访问过，说明该节点可以被访问了。

    const iterationPostOrderTraversal = root => {
      const results = []
      const stacks = []
      let lastVisited = null
      let current = root

      while(current || stacks.length) {
        while(current) {
          stacks.push(current)
          current = current.left
        }
        
        // 🔥 注意，这里引用堆栈里最后的一个值，第一次时，就是左下角的值
        current = stacks[stacks.length - 1]
        // 需要判断这个节点，是否有右节点(有的话，需要继续入栈)，或者被访问过
        //          1
        //         / \
        //        2   3
        //       / \
        //          5
        if (!current.right || current.right === lastVisited) {
          // 当没有左右节点，或者被访问过了，才可以将value放入到结果里
          results.push(current.value)
          // 计入处理完了当前节点，比如5，则可以丢弃5了
          stacks.pop() // 不需要接收了
          // 📌标记下，比如5已经访问过了
          lastVisited = current
          // current 重置，开始下一次stacks.length循环
          current = null
        } else {
          // 参考上面的数据结构，当current为2时，需要将right再入栈，只有左右都入栈了，才可以输出 2 的value
          current = current.right
        }
      }

      return results
    }
    console.log('迭代后序结果：', iterationPostOrderTraversal(root))  // 结果：[4, 5, 2, 3, 1]
    `
  }

  // 数组相关
  bodyMap.arrayDedupliationStr = () => {
    // 下面一行勿动 🚫
    // return `

    // 创建数组的几种方法：
    var arr = [1, 2, 3, 4, 5] // 💥 傻瓜模式
    var arr1 = new Array(1, 2, 3, 4, 5) // 💥 传入一个数字，表示长度，如果传入一个非Number值，则表示值
    var arr2 = Array.of(1, 2, 3, 4, 5) // 💥 不管传入什么，都当成值
    var arr3 = Array.from([1, 2, 3, 4, 5]) // 💥

    // 利用Set
    const depuliationSetArr = [...new Set([1, 2, 2, 3, 3])]
    console.log('set去重：', depuliationSetArr)

    // 利用indxof
    const depuliationIdxArr = [1, 1, 2, 2, 3].map((item, idx, ctx) => idx === ctx.indexOf(item))
    console.log('indexOf去重：', depuliationIdxArr)
    // 下面一行勿动 🚫
    // `
  }

  // 动态规划
  bodyMap.dynamicProgramStr = () => {
    // return `
    // m * n 的矩阵，从左上角，向左向下，到右下角，一共多少种方法
    const dynamicProgramPath = (m, n) => {
      // 🔥 其实动态规划问题，就是分而治之，类似递归，同时需要设置好初始条件
      // 1、初始化二维数组
      const dp = Array(m)
        .fill()
        .map(() => Array(n).fill(0))

      // 2、初始化第一行和第一列为 1
      for (let i = 0; i < m; i++) {
        dp[i][0] = 1
      }
      for (let j = 0; j < n; j++) {
        dp[0][j] = 1
      }

      // 3、从第二行和第二列，开始计算
      for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
          // 当前位置的解法数等于左边位置和上边位置的解法数之和
          dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
        }
      }

      // 返回右下角位置的解法数
      return dp[m - 1][n - 1]
    }
    // 实例: 3*3 矩阵
    // 1 2 3
    // 4 5 6  -> 1236,1256,1456
    console.log('3*3 矩阵的解法：', dynamicProgramPath(3, 2)) // 3

    // `
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
          items={menus}
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
