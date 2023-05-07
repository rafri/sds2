## Discord

The first step in creating a system to allow for a user to be notified of the insertation of a note into the database is to create a discord server with a minimum of one text channel in order for a webhook to be created on and send messages to. This is created by going to server settings, to intergrations and then selecting to create a new webhook, followed by filling in the appropriate sections. Once this webhook has been created on the server, the corresponding URL needs to be copied. In the server.js file, an asynchronous function then needs to created which will send a post request to the webhook, containing the message specified in the body, as shown below:

```async function sendDiscordNotification(){
    const response = await fetch("<webhoook url>", {
        method: 'POST', 
        body: JSON.stringify({ 
            content: 'A note was added to the database.', 
        }),
        headers: { 
            'Content-Type': 'application/json', 
        }, 
    });
}```

This is so that the function can be triggered later on in the program when a note is being inserted into the database.

If multiple people wanted to work on the same notes database and all recieve these notifications, then they are all able to join the discord server. The post request can also be modified in order to show who added the message by passing through an argument to the function with either a username, name or email and this argument can be appended to the content of the body.

```async function sendDiscordNotification(name){
    const response = await fetch("<webhoook url>", {
        method: 'POST', 
        body: JSON.stringify({ 
            content: 'A note was added to the database by ${name} .', 
        }),
        headers: { 
            'Content-Type': 'application/json', 
        }, 
    });
}```

Similarly, if there are multiple users on a system, then the content in the body section of the POST request can be altered to say what table the note has been added to and by what user. This can be done through a similar paramaterization of the POST request.

```async function sendDiscordNotification(dbName, name){
    const response = await fetch("<webhoook url>", {
        method: 'POST', 
        body: JSON.stringify({ 
            content: 'A note was added to the ${dbName} database by ${name} .', 
        }),
        headers: { 
            'Content-Type': 'application/json', 
        }, 
    });
}```

This solution is based off of Client-Server architecture pattern, as it has the client which the user of the notes system based on the website which interacts frequently with the database server which stores all of the notes. The main data type that is used in this notification function is the string data type which is used to store the content of the body of the post request as well as any arguments.