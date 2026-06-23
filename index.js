require("dotenv").config();

const axios = require("axios");
const { App } = require("@slack/bolt");

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true
});

async function thread(client , command , payload) {
    const thread_ts = command.thread_ts ?? null ;
    await client.chat.postMessage ({
        channel: command.channel_id ,
        thread_ts ,
        ...payload
    })
    
}

app.event("message",async({event,client})=>{
    if (event.bot_id || event.subtype) return;

    const text = event.text?.toLowerCase();
    if (!text) return;
    if (text.includes("pikachu")){
        try {
            await client.chat.postMessage ({
                channel:event.channel ,
                thread_ts:event.thread_ts ?? event.ts,
                text:`:hey_pica: pica pica !!`
            })
        } catch (err) {
            console.error("Failed to post pica-hi:",err);
        }
    }
})

app.event("app_mention",async({event,client})=> {
    const text = event.text.replace(/<@[A-Z0-9]+>/g,"").trim();

    if (text === "hi"){
        await client.chat.postMessage({
            channel: event.channel,
            thread_ts: event.thread_ts ?? event.ts ,
            text: `:hey_pika: pica pica`
        })
    }
    else if (text.startsWith("ping ")){
        const target = text.replace("ping ","");
        await client.chat.postMessage({
            channel:event.channel,
            thread_ts: event.thread_ts ?? event.ts,
            text:`<${target}> i m here to destroy ur peace :pikachu-mining:`
        })
    }else if (text == "fact") {
        try {
            const res = await axios.get("https://pokefacts.vercel.app/");
            await client.chat.postMessage({
                channel : event.channel,
                thread_ts:event.thread_ts ?? event.ts,
                text:`Poke-fact time!!:pika-run:\n${res.data.data[0]}`
            })
        }
        catch{
            await client.chat.postMessage({
                channel:event.channel,
                thread_ts:event.thread_ts ?? event.ts,
                text: "srry i forgot the fact :pikawhat:"
            })
        }
    }else if (text.startsWith("tell ")){
        const msg = text.replace("tell ","");
        await client.chat.postMessage({
            channel:event.channel,
            thread_ts:event.thread_ts ?? event.ts ,
            text : msg
        })
    }else if (text.startsWith("attack")){
        const target = text.replace("attack","").trim();
        if (target){
            await client.chat.postMessage({
            channel: event.channel ,
            thread_ts:event.thread_ts ?? event.ts ,
            blocks: [
            {
                type:"section",
                text:{
                    type:"mrkdwn",
                    text:`target locked---<${target}> pica pica pica pica chuuu ⚡`
                }
            },
            {
                type:"image",
                image_url:"https://media.tenor.com/xdE_cr_dBgIAAAAC/pikachu-thunderbolt.gif",
                alt_text:"thunderbolt!"
            }
        ]
        })
        
        }if (!target){
            await client.chat.postMessage({
            channel: event.channel ,
            thread_ts:event.thread_ts ?? event.ts ,
            blocks: [
            {
                type:"section",
                text:{
                    type:"mrkdwn",
                    text:`target locked--- pica pica pica pica chuuu ⚡`
                }
            },
            {
                type:"image",
                image_url:"https://media.tenor.com/xdE_cr_dBgIAAAAC/pikachu-thunderbolt.gif",
                alt_text:"thunderbolt!"
            }
        ]
        })
        }
    }
})

app.command("/pica-help",async({command,ack,client})=>{
    await ack();
    const typed = command.text
    if (!typed) {
        await client.chat.postEphemeral({
           channel: command.channel_id,
           user : command.user_id,
           text:`Commands \n /pica-hi : for saying hello to your friends \n /pica-fact : for random pokemon facts \n /pica-ping : for destroying your friend's peace \n /pica-atc : for self defence only \n /pica-tell : for proving that i can talk`
    
});
    } else {
        await thread ( client,command,{
          text:`Commands \n /pica-hi : for saying hello to your friends \n /pica-fact : for random pokemon facts \n /pica-ping : for destroying your friend's peace \n /pica-atc : for self defence only \n /pica-tell : for proving that i can talk`
    
});
    }});

app.command("/pica-hi",async({command,ack,client})=>{
    await ack();
    await thread(client,command,
        {text: `:hey_pika: pica pica `}
    );
});

app.command("/pica-fact",async({command, ack, client})=>{
    await ack();

    try{
        const response = await axios.get("https://pokefacts.vercel.app/");
           await thread(client ,command,
            {
                text:`Poke-fact time!!:pika-run:\n${response.data.data[0]}`
            });
         } catch(err){
            await thread(client,command,
                {text: "srry i forgot the fact :pikawhat:"}
            );
         }
});

app.command("/pica-ping",async({command,ack,client})=>{
    await ack();
    const target = command.text
    if (!target) {
        await thread(client,command,{text: "Please someone ping anyone cuz i m bore"});
        return;
    }
    await thread(client,command,{
        text:`<${target}> i m here to destroy ur peace :pikachu-mining:`,
    });
});

app.command("/pica-tell",async({command,ack,client})=>{
    await ack();
    const to_tell = command.text 
    if (!to_tell) {
        await thread(client,command,{text:`Pica Pica`});
        return;
    }
    await thread(client,command,{
        text : `${to_tell}`
    })
})

app.command("/pica-atc",async({command,ack,client})=>{
    await ack();
    const target = command.text
    if (!target) {
        await thread(client,command,{
            blocks: [
                {
                    type: "image",
                    image_url:"https://media.tenor.com/xdE_cr_dBgIAAAAC/pikachu-thunderbolt.gif",
                    alt_text:"thunderbolt!"
                }
            ],
            response_type:"in_channel"
        });
        return;
    }
    await thread(client,command,{
        blocks: [
            {
                type:"section",
                text:{
                    type:"mrkdwn",
                    text:`target locked---<${target}> pica pica pica pica chuuu ⚡`
                }
            },
            {
                type:"image",
                image_url:"https://media.tenor.com/xdE_cr_dBgIAAAAC/pikachu-thunderbolt.gif",
                alt_text:"thunderbolt!"
            }
        ],
        response_type:"in_channel"
    });
    
});

process.on('uncaughtException',(err)=>{
    if (err.message?.includes("Unhandled event 'server explicit disconnect'")) {
        console.error('known socket-mode reconnect bug hit-pro')
    } else {
        console.error('Uncaught expection:',err);
    }
});

(async()=>{
    try {
        await app.start();
        console.log("the bot is live");
    } catch(err){
        console.log(err);
    }
})();