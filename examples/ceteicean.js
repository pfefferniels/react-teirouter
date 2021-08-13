import React from 'react'
import ReactDOM from 'react-dom'
import { TEIRender, TEIRoute, TEINodes } from '../src/TEIRouter'
import CETEI from 'CETEIcean'

const teiToHtml = async (file) => {
  const ct = new CETEI()
  ct.addBehaviors({
    'teiHeader': undefined
  })
  return ct.getHTML5(file)
}

const isWithinSpan = (node, spanName, anchor) => {
  let currentAnchor = anchor
  if (node.nodeType === 1) {
    const el = node
    // keep track of anchor ids
    currentAnchor = el.tagName.toLowerCase() === 'tei-anchor' ? el.getAttribute('id') : currentAnchor
    if (el.tagName.toLowerCase() === spanName.toLowerCase()) {
      const spanTo = el.getAttribute('spanTo')
      // if it's the span element, make sure its target anchor hasn't been met yet.
      if (spanTo) {
        if (spanTo.replace('#', '') !== currentAnchor) {
          return true
        }
      }
    } 
  }

  // recurse if the span hasn't been located yet.
  const prev = node.previousSibling || node.parentNode
  if (prev) {
    return isWithinSpan(prev, spanName, currentAnchor)
  }

  return false
}

const TextNode = (props) => {
  const isDeleted = isWithinSpan(props.teiNode, 'tei-delSpan')
  if (isDeleted) {
    return <span style={{textDecoration: 'line-through'}}>
      {props.teiNode.nodeValue}
    </span>
  }
  return <>{props.teiNode.nodeValue}</>
}

const Head = (props) => { 
  return (
    <div style={{
      color: 'red'
    }}>
      {<TEINodes teiNodes={props.teiNode.childNodes} {...props} />}
    </div>
  )
}

class App extends React.Component {
  state = {
    teiData: null
  }

  async componentDidMount() {
    const teiData = await teiToHtml(`./testTEI.xml`)
    this.setState({
      teiData
    })
  }

  render() {
    if (!this.state.teiData) {
      return (null)
    }

    return (
      <TEIRender data={this.state.teiData}>
        <TEIRoute el="tei-head" component={Head}/>
        <TEIRoute el="text()" component={TextNode}/>
      </TEIRender>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));