import { createElement } from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { preloadComponent, isMicro } from 'ssr-client-utils'
import { setStoreContext } from 'ssr-common-utils'
import { wrapComponent } from 'ssr-hoc-react'
import { LayoutProps } from 'ssr-types-react'
import { STORE_CONTEXT as Context } from '_build/create-context'
import { Routes } from './create-router'
import { AppContext } from './context'

const { FeRoutes, layoutFetch, App } = Routes

const clientRender = async (): Promise<void> => {
  const IApp = App ?? function (props: LayoutProps) {
    return props.children!
  }
  setStoreContext(Context)
  // 客户端渲染||hydrate
  const baseName = isMicro() ? window.clientPrefix : window.prefix
  const routes = await preloadComponent(FeRoutes, baseName)
  ReactDOM[window.__USE_SSR__ ? 'hydrate' : 'render'](
    createElement(BrowserRouter, {
      basename: baseName
    }, createElement(AppContext as any, {
      children: createElement(Switch, null,
        createElement(IApp as any, null, createElement(Switch, null, // 使用高阶组件wrapComponent使得csr首次进入页面以及csr/ssr切换路由时调用getInitialProps
          routes.map(item => {
            const { fetch, component, path } = item
            component.fetch = fetch
            component.layoutFetch = layoutFetch
            const WrappedComponent = wrapComponent(component)
            return createElement(Route, {
              exact: true,
              key: path,
              path: path,
              render: () => createElement(WrappedComponent, {
                key: location.pathname
              })
            })
          }))))
    }))
    , document.getElementById('app'))

}

clientRender()

export {
  clientRender
}
