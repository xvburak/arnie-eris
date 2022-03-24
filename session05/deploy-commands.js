const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder()
		.setName('pair')
		.setDescription('pair emoji with are.na channel!')
		.addStringOption(option =>
			option.setName('slug')
				.setDescription('slug is the last part of channel’s link')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('emoji')
				.setDescription('emoji to pair channel with')
				.setRequired(true)),
	new SlashCommandBuilder()
		.setName('tag')
		.setDescription('Fetch paried emojis.')
		.addStringOption(option =>
			option.setName('slug')
				.setDescription('slug is the last part of channel’s link')
				.setRequired(true)),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);