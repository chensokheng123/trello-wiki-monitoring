"use strict";

require("dotenv").config();
const { createEventAdapter } = require('@slack/events-api');
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackEvents = createEventAdapter(slackSigningSecret);

const port = process.env.PORT || 3000;

slackEvents.on('message', (event, respond) => {
    if (event.subtype === "bot_message" && event.bot_id === 'BK8N7AFV0') {
        event.attachments.forEach((ele) => {
            //adding label and removing label
            if (ele.pretext) {
                console.log(ele.pretext);
            }
            // adding and removing
            else if (ele.text) {
                console.log(ele.text);
            }

        });
    }
});



(async () => {
    // Start the built-in server
    const server = await slackEvents.start(port);

    // Log a message when the server is ready
    console.log(`Listening for events on ${server.address().port}`);
})();