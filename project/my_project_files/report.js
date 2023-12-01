function printReport(pages)
{
    console.log("=========");
    console.log("REPORT");
    console.log("=========");

    const sortedPages = sortPages(pages);
    for(const sortedPage of sortedPages)
    {
        const url = sortedPage[0];
        const hits = sortedPage[1];

        console.log(`Found ${hits} links to page: ${url}`);
    }

    console.log("=========");
    console.log("REPORT");
    console.log("=========");
}

function sortPages(pages)
{
    const pagesArr = Object.entries(pages);
    pagesArr.sort((a, b) =>
    {
        // Compare the values for how many times the crawler visited that page
        aHits = a[1];
        bHits = b[1];

        return b[1] - a[1];  // Sorts from greatest to lowest value 
    })
    
    return pagesArr;
}

module.exports =
{
    sortPages,
    printReport
}