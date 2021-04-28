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
    const teiData = await teiToHtml(`https://raw.githubusercontent.com/TEIC/CETEIcean/master/test/testTEI.xml`)
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
      </TEIRender>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));