const Eris = require("eris");
require("pluris")(Eris);
require('dotenv').config();
 
let bot = new Eris(process.env.DSC_SECRET_KEY);
let prefix = "!";

bot.on("ready", () => {
    console.log("ready!");
});

bot.on("messageCreate", async message => {
    if (message.author.bot || !message.channel.guild) return;
    if (!message.content.startsWith(prefix)) return;

    // WITH PLURIS

    if (message.content.toLowerCase().startsWith(`${prefix}embed`)) {
            let embed = new Eris.RichEmbed()
                .setTitle("embed title")
                .setDescription("desc")
                .setFooter("this is a footer")
                .addField("This is a field", "yeet", true)

                return message.channel.createMessage({embed:embed});

    }

    if (message.content.toLowerCase().startsWith(`${prefix}ding`)) {
        return message.channel.createMessage({content: "Dong!!!", messageReferenceID : message.id})
    }
    // PURE JSON

    // if (message.content.toLowerCase().startsWith(`${prefix}embed`)) {
    //     let embed = {
    //         title: "Embed (from Object)",
    //         description: "This is a description",
    //         url: "https://lorem-ipsum.com",
    //         color: 0xFF6600,
    //         footer: {
    //             text: "this is a footer", icon_url: "https://avatars.githubusercontent.com/u/73707226?s=40&v=4"
    //         },
    //         image: {
    //             url: "https://d2w9rnfcy7mm78.cloudfront.net/7533060/original_ee6c99c49d76e8f5d07ce77198693843.png?1591223171?bc=0"
    //         },
    //         thumbnail: {
    //             url: "https://d2w9rnfcy7mm78.cloudfront.net/7533060/original_ee6c99c49d76e8f5d07ce77198693843.png?1591223171?bc=0"
    //         },
    //         field: [
    //             {name: "This is a field", value: "this is a field (values)", inline: true}
    //         ],
    //         author: {
    //             name: "this is an author", url: "https://lorem-ipsum.com"
    //         }
    //     };

    // return message.channel.createMessage({embed: embed}); 
    // }
}); 

bot.connect(); 