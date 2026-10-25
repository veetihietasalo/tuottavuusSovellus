// expo-asset in SDK 49 builds web asset URLs from the domain root ("/assets/..."). That breaks
// the icon fonts when the site is served from a subfolder, like GitHub Pages' /<repo>/.
// This makes them relative to the page instead.
import { setCustomSourceTransformer } from 'expo-asset/build/resolveAssetSource';

setCustomSourceTransformer((resolver) => {
    const source = resolver.defaultAsset();
    return source.uri.startsWith('/') ? { ...source, uri: `.${source.uri}` } : source;
});
