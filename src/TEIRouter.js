import CETEI from 'CETEIcean'
import path from 'path'
import React from 'react'
import warning from 'tiny-warning'
import TEIElement from './TEIElement'
import TEIRoutes from './TEIRoutes'

const teiToHtml = async (file) => {
  const ct = new CETEI()
  ct.addBehaviors({
    'teiHeader': undefined
  })
  return ct.getHTML5(file)
}

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
  state = {
    teiData: null
  }

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

  async componentDidMount() {
    const teiData = await teiToHtml(this.props.tei)
    this.setState({
      teiData
    })
  }

  render() {
    if (!this.state.teiData) {
      return (null)
    }

    return (
      <TEIRoutes.Provider value={this.routes}>
        <TEIElement teiDomElement={this.state.teiData}
                    teiPath={path.dirname(this.props.tei)}
                    availableRoutes={this.availableRoutes}/>
      </TEIRoutes.Provider>
    )
  }
}

export { TEIRender, TEIRoute }
