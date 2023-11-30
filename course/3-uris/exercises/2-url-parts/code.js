function printURLParts(urlString) {
  const urlObj = new URL(urlString)
  
  console.log(
    "protocol:", urlObj.protocol,
    "\nusername:", urlObj.username,
    "\npassword:", urlObj.password,
    "\nhostname:", urlObj.hostname,
    "\nport:", urlObj.port,
    "\npathname:", urlObj.pathname,
    "\nsearch:", urlObj.search,
    "\nhash:", urlObj.hash
  )
}

// don't touch below this line

const fantasyQuestURL = 'http://dragonslayer:pwn3d@fantasyquest.com:8080/maps?sort=rank#id'
printURLParts(fantasyQuestURL)
