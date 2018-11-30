# Webpack Missing Module Dependency

## Background
When the following criteria are met, it seems that webpack misses a module dependency on an async chunk to a shared bundle.

When using `webpack-dev-server`, on code recompilation, this results in one bundle being updated and the other not, which means that the updated function simply cannot be accessed any longer.

Conditions:
* Enable `cacheGroups` to create a shared chunk - extract code from entry points and async chunks
* Have a long dependency tree, where some of the code will eventually be in the shared chunk, and some in the async bundle 

## Repo Explanation
* 3 entry points: `entry-1.js`, `entry-2.js` and `entry-3.js`
* These 3 entry points each dynamically import a respective async module: `entry-async-1.js`, `entry-async-2.js` and `entry-async-3.js`
* For each async bundle, it imports:
  * `deps/<number>-funcs.js` - this imports example functions, one which is specific to the entry point, and the rest which are shared across all entry points.
  * `deps/more-shared-funcs.js` is imported by all async chunks so should end up in the shared bundle.
  * Then just a longer dependency tree to ensure that some of the import definitions will be separated out into the shared bundle, and some into the async bundle
* I also compile 1 html file, which imports the webpack manifest, the shared bundle, and 1 entry point. It outputs the modules which are async imported from `entry-1.js` so we can visually see the bug 

## Reproducing the Error

### Setup
Get `webpack-dev-server` running, and browse to the `webpack-dev-server` page:
```
npm i
npm run build
```

Browse to `https://localhost:1989/webpack-dev-server`

### Visual confirmation of the bug
* Open the HTML file which has been generated by `webpack-dev-server`. When the page loads, you should see 7 object properties output on the page.
* Open `src/deps/shared-funcs.js` and change one of the lines to export a different name e.g.:
```
export { default as three } from '@main/deps/funcs/3';
```
to
```
export { default as threeChanged } from '@main/deps/funcs/3';
```

* `webpack-dev-server` will refresh the page, and the `three` property will disappear, even though it is still being exported under a new name
* Even after hard page refreshes, `three` and `threeChanged` are no where to be seen
* The only way to see `threeChanged` is to kill and restart `webpack-dev-server`

## Theory for the issue

Because of the long export chain, it looks like some of the export declarations are in the `shared` bundle, and some are in the `async` bundle. This is due to the `cacheGroups` implementation of extracting code from both entry points and async chunks, so is expected.

When `webpack-dev-server` recompiles the changes, only one of these bundles is updated, hence the property doesn't show up at all. It seems that a module dependency might be missing between the shared and async bundles here?
