import CETEI from 'CETEIcean'
import path from 'path'
import React from 'react'
import warning from 'tiny-warning'
import TEIElement from './TEIElement'
import TEIRoutes from './TEIRoutes'

const teiUrlToHtml = async (file) => {
  const ct = new CETEI()
  ct.addBehaviors({
    'teiHeader': undefined
  })

  return ct.getHTML5(file)
}

const teiStringToHtml = (data) => {
  const ct = new CETEI()
  ct.addBehaviors({
    'teiHeader': undefined
  })

  return ct.makeHTML5(file)
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
    warning(!(this.props.tei && this.props.teiData),
      `You should not use the tei prop and teiData prop at the same time.`)

    if (this.props.tei) {
      const teiData = await teiUrlToHtml(this.props.tei)
      this.setState({
        teiData,
        teiPath: path.dirname(this.props.tei)
      })
    } else if (this.props.teiData && this.props.path) {
      this.setState({
        teiData: teiStringToHtml(this.props.teiData),
        teiPath: this.props.path
      })
    }
  }

  render() {
    if (!this.state.teiData) {
      return (null)
    }

    return (
      <TEIRoutes.Provider value={this.routes}>
        <TEIElement teiDomElement={this.state.teiData}
                    teiPath={this.state.teiPath}
                    availableRoutes={this.availableRoutes}/>
      </TEIRoutes.Provider>
    )
  }
}

export { TEIRender, TEIRoute }
