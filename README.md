Render TEI files intuitively in React.js using custom routes for TEI elements.
Based in [CETEIcean](https://github.com/TEIC/CETEIcean).

## Usage

```javascript
const cetei = new CETEI()
const data = await cetei.getHTML5(`path/to/file.tei`)

<TEIRender data={data} path={'path/to'}>
  <TEIRoute el='tei-teiheader' component={Header}/>
  <TEIRoute el='tei-notatedmusic' component={MusicExample}/>
  <TEIRoute el='tei-ref' component={Reference}/>
  <TEIRoute el='tei-persname'>
    <LinkToIndex type='indexOfPersons'/>
  </TEIRoute>
</TEIRender>
```

Now custom components ("routes") can be defined for `teiHeader`, `notatedMusic` etc., for example:

```javascript
const Reference = (props) => {
  const target = props.teiDomElement.getAttribute('target')

  return (
    <Link to={target}>
      {props.children}
    </Link>
  )
}
```
