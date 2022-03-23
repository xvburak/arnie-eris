require('dotenv').config();

// const Eris = require('eris');
// const ReactionHandler = require('eris-reactions');
// let bot = new Eris(process.env.DSC_SECRET_KEY);



const Eris = require("eris");

// Replace TOKEN with your bot account's token
const bot = new Eris.CommandClient(process.env.DSC_SECRET_KEY, {}, {
    description: "A test bot made with Eris",
    owner: "somebody",
    prefix: "!"
});

bot.on("messageCreate", async (message) => {

    const reactions = await message.getReaction();
    
    console.log(reactions);
}
)

bot.on("ready", () => { // When the bot is ready
    console.log("Ready!"); // Log "Ready!"
});

bot.on("error", (err) => {
    console.error(err); // or your preferred logger
});

bot.connect();