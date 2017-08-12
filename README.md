## sf-meta-vers

Module abstracting the process of retrieving Package Names, Namespaces, and Version information from a Salesforce packaging Org. Originally developed for use in a CI context. Uses jsforce for all Tooling API requests.

https://www.npmjs.com/package/@davidcdean/sf-meta-vers

https://github.com/DavidCDean/sf-meta-vers

## Installation

`yarn add @davidcdean/sf-meta-vers`
or
`npm install @davidcdean/sf-meta-vers`

## Code Example

```javascript
var sfmv = require('@davidcdean/sf-meta-vers');

var username = process.env.PKG_TEST_USER;
var password = process.env.PKG_TEST_PASS;

function handleResults(results) {
  if (results && results.length) {
    for (var i=0; i<results.length; i++) {
      var pkg = results[i];

      console.log(pkg.Name + ' (' + pkg.NamespacePrefix + ')');
      console.log('Versions Count: ' + pkg.versions.length + '\n');

      pkg.versions.map((ver) => { 
        let fullVer = ver.MajorVersion + '.' + ver.MinorVersion + '.' + ver.PatchVersion;
        console.log(ver.Name + ' - ' + fullVer + ' ' + ver.ReleaseState); });
    }
  }
}

function handleError(err) {
  console.log(err.message);
}

sfmv.getPackageInfo(username, password)
  .then(handleResults)
  .catch(handleError);

```

Example output:

```
MVT Test Pkg 01 (mvt01)
Versions Count: 3

MVTest01 a1 - 1.0.0 Beta
MVTest01 a1 - 1.0.0 Released
New Version Here - 1.1.0 Beta
```

## API Reference

Result objects are Packages with the following properties: 'Id', 'Name', 'NamespacePrefix', and 'versions'.

If no versions are found, Package.versions is an empty list.

Version objects have the following properties: 'MetadataPackageId', 'Name', 'BuildNumber', 'ReleaseState', 'MajorVersion', 'MinorVersion', 'PatchVersion'

## Tests

TODO. :)


## License

ISC - See npm module