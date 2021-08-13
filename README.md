# React TEI Router

Render TEI files intuitively in React.js using custom routes for TEI elements.

The main components `TEIRender` takes in a DOM object and custom routes can be defined to attach components
to elements in the DOM by name.

For TEI rendering we recommend generating the DOM Object with [CETEIcean](https://github.com/TEIC/CETEIcean). See the example in `examples/ceteicean.js` for usage.

## Usage

```JSX
const domData // a DOM object, e.g. generated with CETEIcean.

<TEIRender data={domData}>
  <TEIRoute el='tei-teiheader' component={Header}/>
  <TEIRoute el='tei-notatedmusic' component={NotatedMusic}/>
  <TEIRoute el='tei-media' component={Media}/>
  <TEIRoute el='tei-ref' component={Reference}/>
  <TEIRoute el='tei-persname'>
    <LinkToIndex type='indexOfPersons'/>
  </TEIRoute>
</TEIRender>
```

Now custom components ("routes") can be defined for `teiHeader`, `notatedMusic`, `media` etc., for example:

```JSX
const Reference = (props) => {
  const target = props.teiNode.getAttribute('target')

  return (
    <Link to={target}>
      {props.children}
    </Link>
  )
}
```

To continue applying routes to children, the API exposes `TEINode` for single nodes and `TEINodes` for DOM `NodeList`s.
Make sure to pass the rest of the properties to keep applying routes to children nodes.

```JSX
const Reference = (props) => {
  const target = props.teiNode.getAttribute('target')

  return (
    <Link to={target}>
      {<TEINodes teiNodes={props.teiNode.childNodes} {...props} />}
    </Link>
  )
}
```

It is also possible to specify a route to match text nodes using the keyword `text()`:

```JSX
<TEIRoute el='text()' component={TextNodeHandler}/>
```
