Render TEI files intuitively in React.js using custom routes for TEI elements.
Based in [CETEIcean](https://github.com/TEIC/CETEIcean).

## Usage

```JSX
<TEIRender data='path/to/your.tei'>
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
  const target = props.teiDomElement.getAttribute('target')

  return (
    <Link to={target}>
      {props.children}
    </Link>
  )
}
```
