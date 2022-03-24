const Sequelize = require('sequelize');

const { Client, Intents } = require('discord.js');

require('dotenv').config();


const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'],
});

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage:'database.sqlite',

});

const Tags = sequelize.define('tags', {
	name: {
		type: Sequelize.STRING,
		unique:	true,
	},
	emoji: Sequelize.STRING,
	username: Sequelize.STRING,
	usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

client.once('ready', () => {
	Tags.sync();

	console.log(`Ready, logged as ${client.user.tag}!`);
});


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const { commandName } = interaction;

	// user assignes channel slug to emoji

	if (commandName === 'pair') {
		const slug = interaction.options.getString('slug');
		const emoji = interaction.options.getString('emoji');

		// bot adds data to database
		try {
			const tag = await Tags.create({
				name: slug,
				emoji: emoji,
				username: interaction.user.username,
			});
			// bot gives feedback for user to know its added
			return interaction.reply(`**${tag.name}** paired with ${emoji} for ${tag.username}`);
		}
		catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply('That pair already exists!');
			}

			return interaction.reply('Tomething went wrong with adding pair 😥');
		}

	// fetching data from database
	} else if (commandName === 'tag') {
		const slug = interaction.options.getString('slug');

		const tag = await Tags.findOne({ where: { name:slug } });

		if (tag) {
			tag.increment('usage_count');

			return interaction.reply(tag.get('emoji'));
		}

		return interaction.reply(`Could not find tag: ${slug}`);
	}
});

// client.on ('messageReactionAdd', async (reaction, user) => {
// 	const tag = await Tags.findOne({ where: { emoji:reaction.emoji } });

// 	if (tag) {
// 		tag.increment('usage_count');
// 		return reaction.message.reply(tag.get('name'));
// 	}

// 	return reaction.message.reply(`Could not find tag: ${reaction.emoji}`);

// });


// 💛 = send to dm, 💜 = initiate vote, 🧡 = hotkey

client.on ('messageReactionAdd', async (reaction, user) => {
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			return;
		}
	}

	// check if channel is public and reaction is 💛, sends DM with message link and details
	if (reaction.message.channel.type === 'GUILD_TEXT' && reaction.emoji.name === '💛') {
		// user.send(`${reaction.message.content}`);

		// message has attachment AND conetent
		if (reaction.message.content && reaction.message.attachments) {
			const text = reaction.message.content;
			const attachmentArray = reaction.message.attachments;
			const attachmentItem = attachmentArray.map(x => x.attachment);

			user.send(text);
			for (var i = 0 in attachmentItem) {
				user.send(attachmentItem[i]);
			}
		}
		// message has attachment AND no conetent
		else if (reaction.message.content && !reaction.message.attachments) {
			const text = reaction.message.content;
			user.send(text);
		}
		// message has no attachment AND conetent
		else if (!reaction.message.content && reaction.message.attachments) {
			const attachmentArray = reaction.message.attachments;
			const attachmentItem = attachmentArray.map(x => x.attachment);

			for (var i = 0 in attachmentItem) {
				user.send(attachmentItem[i]);
			}
		}
	} else {
		const tag = await Tags.findOne({ where: { emoji:reaction.emoji.name } });

		if (tag) {
			tag.increment('usage_count');

			return reaction.message.reply(tag.get('name'));
		}
	}

});

// Login to Discord with your client's token
client.login(process.env.token);

