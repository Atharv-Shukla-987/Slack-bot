require("dotenv").config();

const axios = require("axios");
const { App } = require("@slack/bolt");

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true
});

app.command("/pica-help",async({command,ack,respond})=>{
    await ack();
    public = command.text
    if (public) {
        await respond ({
        response_type:"in_channel",
        text:`Commands \n /pica-hi : for saying hello to your friends \n /pica-fact : for random pokemon facts \n /pica-ping : for destroying your friend's peace \n /pica-atc : for self defence only \n /pica-tell : for proving that i can talk`
    })
    }
    if (!public) {
        await respond ({
        text:`Commands \n /pica-hi : for saying hello to your friends \n /pica-fact : for random pokemon facts \n /pica-ping : for destroying your friend's peace \n /pica-atc : for self defence only \n /pica-tell : for proving that i can talk`
    })
    return;
    }
})

app.command("/pica-hi",async({command,ack,respond})=>{
    await ack();
    await respond({text: `:hey_pika: pica pica `,
                   response_type: "in_channel"
    });
});

app.command("/pica-fact",async({ack , respond})=>{
    await ack();

    try{
        const response = await axios.get("https://pokefacts.vercel.app/");
           await respond({text:`Poke-fact time!!:pika-run:\n${response.data.data[0]}`,
                          response_type: "in_channel"});
         } catch(err){
            await respond({text: "srry i forgot the fact :pikawhat:"});
         }
});

app.command("/pica-ping",async({command,ack,respond})=>{
    await ack();
    const target = command.text
    if (!target) {
        await respond({text: "Please someone ping anyone cuz i m bore"});
        return;
    }
    await respond({
        text:`<${target}> i m here to destroy ur peace :pikachu-mining:`,
        response_type:"in_channel"
    });
});

app.command("/pica-tell",async({command,ack,respond})=>{
    await ack();
    const to_tell = command.text 
    if (!to_tell) {
        await respond({text:`Pica Pica`});
        return;
    }
    await respond({
        text : `${to_tell}`,
        response_type:"in_channel"
    })
})

app.command("/pica-atc",async({command,ack,respond})=>{
    await ack();
    const target = command.text
    if (!target) {
        await respond({
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
    await respond({
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

(async()=>{
    await app.start();
    console.log("bot is live!");
})();