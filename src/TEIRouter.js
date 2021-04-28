import React from 'react'
import warning from 'tiny-warning'
import { TEINode, TEINodes } from './TEINode'
import TEIRoutes from './TEIRoutes'

class TEIRoute extends React.Component {
  componentDidMount() {
    warning(!(this.props.children && this.props.component),
      `You should not use child elements and the component attribute
       at the same time.`)
  }

  render() {
    return (null)
  }
}

class TEIRender extends React.Component {
  availableRoutes = []
  routes = {}

  constructor(props) {
    super(props)

    React.Children.forEach(props.children, route => {
      this.availableRoutes.push(route.props.el)
      if (route.props.children) {
        this.routes[route.props.el] = route.props.children
      } else {
        this.routes[route.props.el] = route.props.component
      }
    })
  }

  render() {
    if (!this.props.data) {
      return (null)
    }

    return (
      <TEIRoutes.Provider value={this.routes}>
        <TEINode teiNode={this.props.data}
                 availableRoutes={this.availableRoutes}/>
      </TEIRoutes.Provider>
    )
  }
}

export { TEIRender, TEIRoute, TEINode, TEINodes }
