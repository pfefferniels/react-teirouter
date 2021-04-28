import React from 'react'
import TEIRoutes from './TEIRoutes'

class TEINodes extends React.Component {
  render() {
    let nodes
    if (NodeList.prototype.isPrototypeOf(this.props.teiNodes)) {
      nodes = Array.from(this.props.teiNodes)
    } else if (Array.isArray(this.props.teiNodes)) {
      nodes = this.props.teiNodes
    } else {
      return null
    }

    return nodes.map((child, i) => {
      return <TEINode key={`${child.tagName}${i}`}
                      teiNode={child}
                      availableRoutes={this.props.availableRoutes}/>
    })
  }
}

class TEINode extends React.Component {
  forwardTeiAttributes() {
    return Array.from(this.props.teiNode.attributes).reduce((acc, att) => {
      acc[att.name === 'ref' ? 'Ref' : att.name] = att.value
      return acc
    }, {})
  }

  render() {
    if (!this.props.teiNode) return null

    if (this.props.teiNode.nodeType === 3) {
      return this.props.teiNode.nodeValue
    }

    if (this.props.teiNode.nodeType !== 1 ) return null

    const el = this.props.teiNode
    const tagName = el.tagName.toLowerCase()

    const teiChildren = <TEINodes teiNodes={el.childNodes} {...this.props} />

    if (this.props.availableRoutes.includes(tagName)) {
      const propsClone = {
        ...this.props,
        teiNode: el.cloneNode(true)
      }

      return (
        <TEIRoutes.Consumer>
          {(routes) => {
            const selectedRoute = routes[tagName]

            // Routes can be given as child elements that are
            // created already and need to be cloned here,
            // or as a component, that is not yet instantiated.
            if (React.isValidElement(selectedRoute)) {
              return React.cloneElement(selectedRoute,
                                        {...propsClone},
                                        teiChildren)
            }

            return React.createElement(selectedRoute,
                                       propsClone,
                                       teiChildren)
          }}
        </TEIRoutes.Consumer>
      )
    }

    return React.createElement(tagName,
                               {...this.forwardTeiAttributes()},
                               teiChildren)
  }
}

export { TEINode, TEINodes }
