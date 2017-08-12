const jsforce = require('jsforce');


/**
 * Fetches all Metadata Packages and
 * their versions, with details, from
 * a Salesforce packaging Org.
 * 
 * @param {string} username
 * @param {string} password
 * @returns {Promise.Package[]} A Promise that returns a list of Package objects with their Versions
 */
export function getPackageInfo(username, password) {
  const conn = new jsforce.Connection();

  const loginPromise = conn.login(username, password);
  const packagesPromise = loginPromise.then(() => fetchPackages(conn));
  const versionsPromise = Promise.all([loginPromise, packagesPromise])
    .then(results => fetchVersions(conn, results[1]));

  return Promise.all([packagesPromise, versionsPromise])
    .then(results => processVersions(results[0], results[1]));
}


/**
 * Uses a Connection object to query for all
 * Metadata Packages in a packaging Org
 * 
 * @param {jsforce.Connection} conn
 * @returns {Promise.Package[]} Promise that returns a list of Package objects
 */
function fetchPackages(conn) {
  const pkgFields = ['Id', 'Name', 'NamespacePrefix'];
  return conn.tooling.sobject('MetadataPackage').find({}, pkgFields);
}


/**
 * Uses a list of provided Package objects to
 * query for Versions using Package.Id
 * 
 * @param {jsforce.Connection} conn
 * @param {Package[]} packages
 * @returns {Promise.Version[]} Promise that returns a list of Version objects
 */
function fetchVersions(conn, packages) {
  if (!packages || !packages.length) return Promise.resolve([]);

  const packageIds = packages.map(packageRec => packageRec.Id);
  const versionFields = ['MetadataPackageId', 'Name', 'BuildNumber', 'ReleaseState', 'MajorVersion', 'MinorVersion', 'PatchVersion'];

  return conn.tooling.sobject('MetadataPackageVersion').find({ MetadataPackageId: packageIds }, versionFields);
}


/**
 * Packs any retrieved Version results on
 * their corresponding Package objects (.versions).
 * 
 * @param {Package[]} packages
 * @param {Version[]} versions
 * @returns {Package[]} List of Package objects with their Versions
 */
function processVersions(packages, versions) {
  packages.map((pkg) => { pkg.versions = []; });

  for (let i = 0; i < versions.length; i++) {
    const version = versions[i];

    for (let x = 0; x < packages.length; x++) {
      const pkg = packages[x];
      if (pkg.Id === version.MetadataPackageId) {
        pkg.versions.push(version);
        break;
      }
    }
  }

  return packages;
}
