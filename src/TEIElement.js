import React from 'react'
import TEIRoutes from './TEIRoutes'

// This is based on an idea found here, but taking it a step further:
// https://github.com/raffazizzi/mermtt/blob/master/src/TeiElement.js

class TEIElement extends React.Component {
  forwardTeiAttributes() {
    return Array.from(this.props.teiDomElement.attributes).reduce((acc, att) => {
      acc[att.name === 'ref' ? '_ref' : att.name] = att.value
      return acc
    }, {})
  }

  render() {
    const el = this.props.teiDomElement
    const tagName = el.tagName.toLowerCase()

    const teiChildren = Array.from(el.childNodes).map((teiEl, i) => {
      switch (teiEl.nodeType) {
        case Node.ELEMENT_NODE:
          return (
            <TEIElement key={`${teiEl.tagName}${i}`}
                        teiDomElement={teiEl}
                        teiPath={this.props.teiPath}
                        availableRoutes={this.props.availableRoutes}/>)
        case Node.TEXT_NODE:
          return teiEl.nodeValue
        default:
          return null
      }
    })

    if (this.props.availableRoutes.includes(tagName)) {
      const propsClone = {
        ...this.props,
        teiDomElement: this.props.teiDomElement.cloneNode(true)
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

export default TEIElement
