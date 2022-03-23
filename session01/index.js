
const Eris = require("eris");
require('dotenv').config();

let bot = new Eris(process.env.DSC_SECRET_KEY);
let prefix = "!";

bot.on("ready", () => {
    console.log("ready!");
});

bot.on("messageCreate", async message => {
    if (message.author.bot || !message.channel.guild) return;
    if (!message.content.startsWith(prefix)) return;
 
    if (message.content.startsWith(`${prefix}ping`)) {
        return message.channel.createMessage("Pong!");
    };
}); 

bot.connect(); 