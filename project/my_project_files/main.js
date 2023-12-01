const {crawlPage} = require("./crawl.js");

function main()
{
    if(process.argv.length < 3)
    {
        console.log("No website provided.");
        process.exit(1);  // 1 is a standard error code
    }
    else if(process.argv.length > 3)
    {
        console.log("Too many command line arguments.");
        process.exit(1);
    }
    const baseURL = process.argv[2]  // website entered in command line

    console.log(`starting crawl of ${baseURL}`);
    crawlPage(baseURL);
}

main()