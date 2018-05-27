const Discord = require(`discord.js`);
const client = new Discord.Client();
// The token of your bot - https://discordapp.com/developers/applications/me
const token = `NDQzODIwMDA3MzgyNzEyMzIw.DdTunQ.uM-_YX24vd4qQrldr31JCVA-QDA`;

//Constants
const adminList = [`137041823683182592`];
//Local
var database = require(`./database.js`);
var generator = require(`./generator.js`);
//Flag
var devMode = false;
var enableDB = false;
var cleanMode = false;
var welcoemMessage = false;

//Admin IDs
var moderatorList = [`137041823683182592`];
var GAME_ROLES = [`Starcraft`, `Destiny`, `WoW`, `Rocket League`, `Hearthstone`, `Smash4`, `Melee`, `Smash`,`Overwatch`, `CS:GO`, `Smite`, `Fire Emblem`, `Paladins`, `Pokemon`, `Runescape`, `Tabletop`, `PUBG`, `Rainbow Six Siege`, `DotA`, `HOTS`, `League of Legends`, `Fortnite`, `PS4`, `XBOX`, `Switch`]
var MEMBER_COMMANDS = [`!role`, `!unrole`, `!avatar`, `!invite`, `!who`];
var ADMIN_COMMANDS = [`!cleanmode`,`!channel`, `channel introductions`, `!channel list`, `!channel rules`, 'channel update', `!devmode`, `!emotelist`,'!promote', '!deomote', `status`, `welcome`, `!welcomeimage`,`!welcomemessage`];
var MOD_COMMANDS = [`!announcement`];
var logChannel = ``;
var channelList = {};
var introductions = '#introductions';
var rules = "#welcome";
var welcomeImage = "https://s26.postimg.cc/8x8hnunux/Reddit_Link.png";

//Helpers
function remove(array, element) {
    const index = array.indexOf(element);
    if (index !== -1) {
        array.splice(index, 1);
    }
}

function removeAll(array, element) {
	return array.filter(e => e !== element);
  //test
}
var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === `function`) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};

let roleList = ``;
var commandList = ``;
var adminCommandList = ``;
var modCommandList = ``;


function fillLists(){
  // Role List
  GAME_ROLES.forEach((role) => {
    roleList = roleList.concat(`- ${role}\n`);
  });
  //Command Lists
  MEMBER_COMMANDS.forEach((role) => {
    commandList = commandList.concat(`- \`${role}\`\n`);
  });
  //Admin Lists
  ADMIN_COMMANDS.forEach((role) => {
    adminCommandList = adminCommandList.concat(`- \`${role}\`\n`);
  });
  //Mod Lists
  MOD_COMMANDS.forEach((role) => {
    modCommandList = modCommandList.concat(`- \`${role}\`\n`);
  });
};

client.on(`ready`, () => {
  console.log(`I am ready!`);
  if(enableDB){
  	console.log(database.readyCheck());
	}
  if(devMode){
    console.log('devMode Enabled');
  }
  if(cleanMode){
    console.log('cleanMode Enabled');
  }
  fillLists();
});

client.on(`message`, (message) => {
	//Full Log
  if(devMode){
    	//console.log(message)
	}else{
    //Shorthand Log
    if(message.channel != `DMChannel` && message.channel.guild){
      console.log(`Server: ` + message.channel.guild.name);
      //client.channels.get().send(message);
    }
    console.log(`Channel: ` + message.channel.name);
    console.log(`Message: ` + message.content);
    console.log(`Author: ` + message.author.username);
  }
   	/*
   	var myobj = {

   		name: message.author.username,
   		content: message.content
   	};*/
   	//Database Stuff for nerds
   	if(enableDB){
   	var myobj = {
		server:
		{
			serverID: message.channel.guild.id,
			serverName: message.channel.guild.name,
			serverRegion: message.channel.guild.region
		},
		channel:
		{
			channelID: message.channel.id,
			channelName: message.channel.name,
		},
		author:
		{
			username: message.author.username,
			id: message.author.id,
			bot: message.author.bot
		},
		message: message.content,
		timestamp: message.createdTimestamp
		};
	database.insert(`messages`, myobj);
	}
  var admin = contains.call(adminList, message.author.id);
  var mod = contains.call(moderatorList, message.author.id);
	// Set prefix
  let prefix = `!`
  // Exit if bot or prefix not found: Do all non-commands above this line
  if(!message.content.startsWith(prefix) || message.author.bot){
    return
  }
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if(devMode){
    console.log(`-----------------`);
    console.log('Command Detected');
    console.log(`Admin: ` + admin);
    console.log(`Moderator: ` + mod);
    console.log(`Args: ` + args);
    console.log(`Command: ` + command);
    console.log(`-----------------`);
  }
  //Deletes commands when sent
  if(cleanMode && message.channel != `DMChannel`){
    message.delete()
    .then(msg => console.log(`Deleted message from ${msg.author.username}`))
    .catch(console.error);
  }
  //Admin Only tools
  if (admin){
    if(devMode){
      message.channel.send(`Admin premission granted!`);
    }
    /*message.channel.send(command);*/
    //Channel Commands
    if(command === 'channel'){
      //Updates Channel info on bot
      if(args[0]==='update'){
        channelList[message.channel.name] = message.channel.id;
        if(cleanMode){
          message.author.send(`**Updated** ${message.channel} -> ${channelList[message.channel.name]}`);
        }else{
          message.channel.send(`**Updated** ${message.channel} -> ${channelList[message.channel.name]}`);
        }
      //Lists channels with shortcuts
      }else if(args[0]==='list'){
        //TODO
        message.channel.send(`**The following channels shortcuts are avalibale: **Currently Bugged #TODO** `);
      }else if(args[0]==='rules'){
        rules = message.channel;
        message.author.send(`**Updated** ${message.channel} -> Rules Channel}`);
        message.delete();
      }else if(args[0]==='introductions'){
        introductions = message.channel;
        message.author.send(`**Updated** ${message.channel} -> Introductions Channel}`);
        message.delete();
      }else{
        message.channel.send(`**Info for** ${message.channel}`);
        message.channel.send(`**ID:** ${message.channel.id}`); 
      }
      return;       
    }
    //Lists emotes on the server
    if (command === `emotelist`) {
      const emojiList = message.guild.emojis.map(e=>e.toString()).join(` `);
      message.channel.send(emojiList);
      return;
    }
    if (command == `welcome`){
      message.channel.send(" ", {files: [welcomeImage]}).catch(console.error);
      setTimeout(function(){
      message.channel.send(`Welcome to the Tespa Carleton Discord Server!\nPlease read the rules in ${rules} and  then introduce yourself in ${introductions}.\nIf you have any questions, do not hesitate to send a direct message to an Executive or Council member!`);}, 1000);
      return;
    }
    if (command == `devmode`){
      if(devMode){
        message.channel.send(`Disabling DevMode. Who needs all those nerdy stats anyways.`);
        devMode = false;
      }else{
        message.channel.send(`Enabling DevMode. Do your best!`);
        devMode = true;
      }
      return;
    }
    if (command == `cleanmode`){
      if(cleanMode){
        message.channel.send(`Disabling CleanMode. Back to normal.`);
        cleanMode = false;
      }else{
        message.channel.send(`Enabling CleanMode. Working in secret I see.`);
        cleanMode = true;
      }
      return;
    }
    if (command == `status`){
      if(!cleanMode){
        message.channel.send(`**Status:** \nDev Mode: \`${devMode}\`\nClean Mode: \`${cleanMode}\`\nDatabase Connection: \`${enableDB}\`\nWelcome Message: \`${welcoemMessage}\``);
      }else{
        message.author.send(`**Status:** \nDev Mode: \`${devMode}\`\nClean Mode: \`${cleanMode}\`\nDatabase Connection: \`${enableDB}\`\nWelcome Message: \`${welcoemMessage}\``);
      }
      return;
    }
    if (command == `welcomemessage`){
      if(welcoemMessage){
        message.channel.send(`Disabling Welcome Message!`);
        welcoemMessage = false;
      }else{
        message.channel.send(`Enabling Welcome Message. Happy to help!`);
        welcoemMessage = true;
      }
      return;
    }
    if(command == `admin`){
      message.channel.send(`Here are some things I can help you with as an admin: \n${adminCommandList}`);
      return
    }
    if(command === 'welcomeimage'){
      if(!args[0]){
        message.channel.send(`You need arguements for \`${command}\``);
        return
      }
      welcomeImage = args[0];
      message.channel.send(`Changed Welcome image to ${welcomeImage}.`);
      return
    }
    if(command === 'promote'){
      if(!args[0]){
        message.channel.send(`You need arguements for \`${command}\``);
        return
      }
      moderatorList.push(args[0]);
      message.channel.send(`Mod List Updated!`);
      return
    }
    if(command === `demote`){
      if(!args[0]){
        message.channel.send(`You need arguements for \`${command}\``);
        return
      }
      remove(moderatorList, args[0]);
      message.channel.send(`Mod List Updated!`);
      return
    }
  }
  //Moderator Only tools
  if (mod){
    if(devMode){
      message.channel.send(`Moderator speaking - everyone better listen up!`);
    }
    //Make an announcement
    if(command === 'announcement'){
      var channel = args.shift();
      if (channelList[channel]){
        message.channel.send(`**Channel ID: ** ${channelList[channel]}`);
        channel = channelList[channel];
      }
      if(client.channels.get(channel)){
        //Images
        var delay = 0;
        //Broken with cleanMode #BUG #TODO
        for (var [snowflake, attachment] of message.attachments) {
          delay++;
          client.channels.get(channel).send(" ", {files: [attachment.url]}).catch(console.error);
        }
        //Message
        if(args[0]){
          setTimeout(function(){
            client.channels.get(channel).send(args.join(" ")).catch(console.error);
          }, 1000*delay);
        }
      }else{
        message.channel.send(`The channel ID \`${channel}\` is not avalibale. Please check them channel ID`)
      }
      return;
    }
    if(command == `mod`){
      message.channel.send(`Here are some things I can help you with as an moderator: \n${modCommandList}`);
      return;
    }
  }

  if(command == 'avatar'){
        message.reply(`here is the link ${message.author.displayAvatarURL}`);
        return;
  }
  if(command == 'invite'){
        message.reply(`the invite link is \`http://discord.gg/tespacarleton\``);
        return;
  }
  if(command == 'role'){
    if (args.length < 1 || args[0] == `--help`) {
        message.channel.send(`**These are game roles you're allowed to join:** \n${roleList} \nUse \`!role <role_name>\` to join a role \nUse \`!rmrole <role_name>\` to leave a role`)
        return;
    }

    let role = message.guild.roles.find(`name`, args.join(' '));
    if (GAME_ROLES.indexOf(args.join(' ')) === -1){
      message.channel.send(`Doesn't look like you're allowed to join ${args.join(' ')}.\nFor a full list of joinable roles use \`!role --help\` \nUse \`!role <role_name>\` to join a role \nUse \`!rmrole <role_name>\` to leave a role`)
      return;
    }
      message.member.addRole(role).catch(console.error);
      //Hack for Smash
      if(args[0] === `Smash4` || args[0] === `Melee`){
        message.member.addRole(`Smash`).catch(console.error);
      }

      message.channel.send(`You've been added to: ${args.join(' ') }!` );
      return
  }
  if(command == 'rmrole'){
    let role = message.guild.roles.find(`name`, args.join(' '));
    if (role){
      message.member.removeRole(role).catch(console.error);
      message.channel.send(`Yor are no longer a member of: ${args.join(' ') }... \nSorry to see you go` );
      return
    }
    message.channel.send(`I can't find the role${args.join(' ')}.\nAre you sure that is the name of the role you want to remove?\nUse \`!role <role_name>\` to join a role \nUse \`!rmrole <role_name>\` to leave a role`)
    return
  }
  if(command ==  `help`){
    message.channel.send(`Here are some things I can help you with: \n${commandList}`);
    return;
  }
  if(command ==  `who`){
    message.reply(`ID: \`${message.author.id}\``);
    return;
  }
  if(command == 'hello'){
    message.reply(`${generator.message(`Greeting`,command)}`)
    return;
  }
    message.channel.send(`${generator.message(`Command Not Found`,command)}`)
});

client.on(`error`, e => { console.error(e) })

client.on(`guildMemberAdd`,member=>{
  if(welcoemMessage){
  member.send(" ", {files: [welcomeImage]}).catch(console.error);
  setTimeout(function(){
    member.send(`Welcome to the Tespa Carleton Discord Server!\nPlease read the rules in ${rules} and  then introduce yourself in ${introductions}.\nIf you have any questions, do not hesitate to send a direct message to an Executive or Council member!`);
    }, 1000);
  }
});

client.login(token);
