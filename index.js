require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

const CHAT_ID = process.env.CHAT_ID;
const TEST_MODE = process.env.TEST_MODE === "true";

const TIMEZONE = "Europe/London";

// Posts every 4 hours, but only between 6am and 10pm UK time
const POST_INTERVAL_HOURS = 4;
const POST_INTERVAL_MS = POST_INTERVAL_HOURS * 60 * 60 * 1000;

const messages = [
`Blown challenges. Overtrading. Inconsistent results. Sound familiar? 🤔

Let us handle the passing while you focus on scaling a funded account 📈

Message us "READY" and I’ll break everything down for you 🫡✅`,

`Ready to Get Funded Without the Stress? 👊🏻

At Vertex, we specialize in passing prop firm challenges for you — so you can skip the pressure and go straight to trading funded capital 🤝

No time to waste, DM us to get started 🫡`,

`Stop Failing Challenges. Start Trading Funded 💰

At Vertex, we don’t guess — we execute 🫡

We help traders secure funded accounts by passing prop firm challenges on their behalf, using disciplined strategies and strict risk management 📈

💼 Why traders choose us:
• Consistent results
• Professional risk control
• Fast, efficient delivery
• Zero emotional trading

Ready to start? Message "FUNDED" to get started 👊🏻`,

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

let currentIndex = 0;

function getUKHour() {
  const ukTime = new Date().toLocaleString("en-GB", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    hour12: false
  });

  return Number(ukTime);
}

function isWithinPostingWindow() {
  const hour = getUKHour();

  // Posts from 06:00 up to 21:59 UK time
  return hour >= 6 && hour < 22;
}

async function sendMessage() {
  try {
    const message = messages[currentIndex];

    await bot.sendMessage(CHAT_ID, message);

    console.log(`✅ Sent message ${currentIndex + 1}`);

    currentIndex = (currentIndex + 1) % messages.length;
  } catch (error) {
    console.error("❌ Send error:", error.message);
  }
}

async function sendAllMessages() {
  console.log("🚀 TEST MODE: Sending all messages instantly...");

  for (let i = 0; i < messages.length; i++) {
    try {
      await bot.sendMessage(CHAT_ID, messages[i]);
      console.log(`✅ Sent test message ${i + 1}`);

      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error("❌ Test send error:", error.message);
    }
  }

  console.log("✅ Test mode complete.");
}

async function startBot() {
  if (!process.env.BOT_TOKEN) {
    console.error("❌ Missing BOT_TOKEN in Railway variables.");
    return;
  }

  if (!CHAT_ID) {
    console.error("❌ Missing CHAT_ID in Railway variables.");
    return;
  }

  console.log("🤖 Telegram bot started.");
  console.log(`🕒 Posting window: 06:00 - 22:00 UK time`);
  console.log(`⏱ Interval: every ${POST_INTERVAL_HOURS} hours`);

  if (TEST_MODE) {
    await sendAllMessages();
    return;
  }

  if (isWithinPostingWindow()) {
    await sendMessage();
  } else {
    console.log("⏸ Bot started outside posting window. Waiting for next interval.");
  }

  setInterval(async () => {
    if (!isWithinPostingWindow()) {
      console.log("⏸ Outside posting window. Skipping post.");
      return;
    }

    await sendMessage();
  }, POST_INTERVAL_MS);
}

startBot();
