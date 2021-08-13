import React from 'react'
import TEIRoutes from './TEIRoutes'
import { toJSON } from 'cssjson'

class TEINodes extends React.Component {
  render() {
    const nodes = Array.from(this.props.teiNodes)

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
      switch (att.name) {
        case 'ref':
          acc['Ref'] = att.value
          break
        case 'style':
          acc['style'] = toJSON(att.value)
          break
        default:
          acc[att.name] = att.value
      }
      return acc
    }, {})
  }

  render() {
    if (!this.props.teiNode) return null

    let matchName
    let teiChildren

    // Return an element if this is a text node and there is a text() route
    // or if a route matches the current element node's tagname.
    if (this.props.teiNode.nodeType === 3) {
      if (this.props.availableRoutes.includes('text()')) {
        matchName = 'text()'
      } else {
        return this.props.teiNode.nodeValue
      }
    } else if (this.props.teiNode.nodeType === 1) {
      const el = this.props.teiNode
      const tagName = el.tagName.toLowerCase()
      teiChildren = <TEINodes teiNodes={el.childNodes} {...this.props} />

      if (this.props.availableRoutes.includes(tagName)) {
        matchName = tagName
      } else {
        // Return unchanged element.
        return React.createElement(tagName,
          {...this.forwardTeiAttributes()},
          teiChildren)
      }
    } else {
      return null
    }

    return (
      <TEIRoutes.Consumer>
        {(routes) => {
          const selectedRoute = routes[matchName]

          // Routes can be given as child elements that are
          // created already and need to be cloned here,
          // or as a component, that is not yet instantiated.
          if (React.isValidElement(selectedRoute)) {
            return React.cloneElement(selectedRoute,
                                      {...this.props},
                                      teiChildren)
          }

          return React.createElement(selectedRoute,
                                      {...this.props},
                                      teiChildren)
        }}
      </TEIRoutes.Consumer>
    )
  }
}

export { TEINode, TEINodes }
