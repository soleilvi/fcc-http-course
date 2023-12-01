const { JSDOM } = require("jsdom");

function getURLsFromHTML(htmlBody, baseURL)
{
    const urls = [];
    const dom = new JSDOM(htmlBody);  // Takes HTML as a string and creates a document obj model 
    const linkElements = dom.window.document.querySelectorAll("a");  // "a" refers to the HTML section with the URLs

    for(const linkElement of linkElements)
    {
        if(linkElement.href.slice(0, 1) === '/')
        {
            // URL is relative
            try
            {
                const urlObj = new URL(`${baseURL}${linkElement.href}`);
                urls.push(urlObj.href);
            }
            catch(err)
            {
                // URL is not valid
                console.log(`error with relative url: ${err.message}`);
            }
        } 
        else
        {
            // URL is absolute
            try 
            {
                const urlObj = new URL(linkElement.href);
                urls.push(urlObj.href);
            }
            catch(err)
            {
                // URL is not valid
                console.log(`error with absolute url: ${err.message}`);
            }
        }
    }

    return urls;
}

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

// Makes the normalizeURL function available to other JS files that want to import it
module.exports =
{
    normalizeURL,
    getURLsFromHTML
}