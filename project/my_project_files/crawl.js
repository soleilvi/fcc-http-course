const {JSDOM} = require("jsdom");

async function crawlPage(baseURL, currentURL, pages)
{
    const baseURLObj = new URL(baseURL);
    const currentURLObj = new URL(currentURL);
    if(baseURLObj.hostname !== currentURLObj.hostname)
    {
        // Ensures that the crawler stays inside the scope of the domain passed into the command line
        return pages;
    }

    const normalizedCurrentURL = normalizeURL(currentURL);
    if(pages[normalizedCurrentURL] > 0)
    {
        // Update the amount of times we have seen this page (how many tiems it is linked in the site)
        pages[normalizedCurrentURL]++;
        return pages;
    }
    pages[normalizedCurrentURL] = 1;  // Map the URL into pages if we haven't seen it before

    console.log(`actively crawling ${currentURL}`);

    try 
    {
        const resp = await fetch(currentURL);  // Makes a "GET" request by default, no need to pass in that command
        if(resp.status > 399) 
        {
            console.log(`Error in fetch with status code: ${resp.status} on page: ${currentURL}`);
            return pages;
        }

        const contentType = resp.headers.get("content-type");
        if(!contentType.includes("text/html"))
        {
            // URL does not have valid HTML
            console.log(`Non-HTML response, content type: ${contentType} on page: ${currentURL}`);
            return pages;
        }
        
        const htmlBody = await resp.text();  // No .json() because we're expecting HTML
        const nextURLs = getURLsFromHTML(htmlBody, baseURL);  // Get the URLs linked in this page
        
        for(const nextURL of nextURLs)
        {
            // Recursively go through all the pages in this website
            pages = await crawlPage(baseURL, nextURL, pages);
        }
    }
    catch(err)
    {
        console.log(`Error in fetch: ${err.message}, on page ${currentURL}`);
    }

    return pages;
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