import {
  MenuFoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { Button, Layout, Menu, theme } from 'antd'
import { useState } from 'react'
const { Header, Sider, Content } = Layout
const BeautifulJs = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [curMenu, setCurMenu] = useState('')
  // const {
  //     token: { colorBgContainer },
  // } = theme.useToken();

  const clickMenu = (evt) => {
    console.log('djch evt', evt)
    const { key: menuKey } = evt
  }

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
              key: '',
              icon: <UserOutlined />,
              label: 'Promise相关',
              children: [
                {
                  key: '2',
                  icon: <VideoCameraOutlined />,
                  label: 'promiseAll',
                },
                {
                  key: '3',
                  icon: <UploadOutlined />,
                  label: 'promiseLimit',
                },
              ],
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: '链表相关',
            },
            {
              key: '3',
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
            {promiseLimit.toString()}
          </SyntaxHighlighter>
        </Content>
      </Layout>
    </Layout>
  )
}
export default BeautifulJs
