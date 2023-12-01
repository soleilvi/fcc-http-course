const {JSDOM} = require("jsdom");

async function crawlPage(currentURL)
{
    console.log(`actively crawling ${currentURL}`);

    try 
    {
        const resp = await fetch(currentURL);  // Makes a "GET" request by default, no need to pass in that command
        if(resp.status > 399) 
        {
            console.log(`Error in fetch with status code: ${resp.status} on page: ${currentURL}`);
            return;
        }

        const contentType = resp.headers.get("content-type");
        if(!contentType.includes("text/html"))
        {
            // URL does not have valid HTML
            console.log(`Non-HTML response, content type: ${contentType} on page: ${currentURL}`);
            return;
        }
        
        console.log(await resp.text());  // no .json() because we're expecting HTML
    }
    catch(err)
    {
        console.log(`Error in fetch: ${err.message}, on page ${currentURL}`);
    }
}

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

// Makes these functions available to other JS files that want to import them
module.exports =
{
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}