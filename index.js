"use strict";
const request = require("request");
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
                // console.log(ele.pretext);
                get_all_cards_status()
            }
            // adding and removing
            else if (ele.text) {
                // console.log(ele.text);
                get_all_cards_status()
            }

        });
    }

});
setInterval(() => {
    get_all_cards_status()
}, 60000);


(async () => {
    // Start the built-in server
    const server = await slackEvents.start(port);

    // Log a message when the server is ready
    console.log(`Listening for events on ${server.address().port}`);
})();



function get_all_cards_status() {

    var options = {
        url: `https://api.trello.com/1/boards/${process.env.BOARD_ID}/cards/?labels=true&key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`
    };

    request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            let data = JSON.parse(body);
            let card_status = [];
            data.forEach((card) => card.labels.length !== 0 ? card_status.push({ 'card_name': card.name, "label_name": card.labels[0].name, "label_color": card.labels[0].color }) : card_status.push({ 'card_name': card.name, 'card_labels': 'empty' }));
            console.log("========================\n", card_status, "\n========================");
        }
    });
}