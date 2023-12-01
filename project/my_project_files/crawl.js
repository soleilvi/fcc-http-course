function normalizeURL(urlString)
{
    const urlObj = new URL(urlString);
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`;

    if(hostPath.length > 0 && hostPath.slice(-1) === '/')
    {
        return hostPath.slice(0, -1);  // Everything except last char
    }

    return hostPath;
}

// makes the normalizeURL function available to other JS files that want to import it
module.exports =
{
    normalizeURL
}