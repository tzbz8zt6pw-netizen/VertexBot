require("dotenv").config();

const { Client, GatewayIntentBits, Events } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const CHANNEL_ID = process.env.CHANNEL_ID;

// Set TEST_MODE=true in Railway to send all messages instantly
const TEST_MODE = process.env.TEST_MODE === "true";

// Time between normal auto-posts
const POST_INTERVAL_HOURS = 6;
const POST_INTERVAL_MS = POST_INTERVAL_HOURS * 60 * 60 * 1000;

const messages = [
`Blown challenges. Overtrading. Inconsistent results. Sound familiar? 🤔

Let us handle the passing while you focus on scaling a funded account 📈

Message us “READY” and I’ll break everything down for you🫡✅`,

`Ready to Get Funded Without the Stress?👊🏻

At Vertex, we specialize in passing prop firm challenges for you — so you can skip the pressure and go straight to trading funded capital🤝

No time to waste, DM us to get started 🫡`,

`Stop Failing Challenges. Start Trading Funded💰 

At Vertex, we don’t guess — we execute🫡

We help traders secure funded accounts by passing prop firm challenges on their behalf, using disciplined strategies and strict risk management📈

💼 Why traders choose us:
• Consistent results
• Professional risk control
• Fast, efficient delivery
• Zero emotional trading

Ready to start? Message “FUNDED” to get started 👊🏻`,

`Still blowing accounts? Be honest.

Most traders fail challenges not because they’re stupid — but because they lack consistency and discipline.

That’s where Vertex comes in.

We pass prop firm challenges for you — simple.

✔️ We pass
✔️ You pay 
✔️ You get funded

💸 Discounts live right now — but not for long.

Stop repeating the same cycle.

📩 DM now before slots fill.`
];

let currentMessageIndex = 0;

async function sendMessage(channel) {
  const message = messages[currentMessageIndex];

  await channel.send(message);

  console.log(`Sent message ${currentMessageIndex + 1}`);

  currentMessageIndex = (currentMessageIndex + 1) % messages.length;
}

async function sendAllMessages(channel) {
  for (const message of messages) {
    await channel.send(message);
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  console.log("All test messages sent.");
}

client.once(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const channel = await client.channels.fetch(CHANNEL_ID);

  if (!channel) {
    console.error("Channel not found. Check CHANNEL_ID.");
    return;
  }

  if (TEST_MODE) {
    await sendAllMessages(channel);
    return;
  }

  await sendMessage(channel);

  setInterval(async () => {
    try {
      await sendMessage(channel);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, POST_INTERVAL_MS);
});

client.login(process.env.DISCORD_TOKEN);
