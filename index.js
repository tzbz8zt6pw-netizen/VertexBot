require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

// Create bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

// ENV
const CHAT_ID = process.env.CHAT_ID;

// 🔒 SAFER TEST MODE PARSE
const TEST_MODE = String(process.env.TEST_MODE).trim().toLowerCase() === "true";

const TIMEZONE = "Europe/London";

// Posting interval
const POST_INTERVAL_HOURS = 4;
const POST_INTERVAL_MS = POST_INTERVAL_HOURS * 60 * 60 * 1000;

// Messages
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

// Get UK hour safely
function getUKHour() {
  const now = new Date();
  const ukTime = new Date(
    now.toLocaleString("en-GB", { timeZone: TIMEZONE })
  );
  return ukTime.getHours();
}

// Check window (6am–10pm)
function isWithinPostingWindow() {
  const hour = getUKHour();
  return hour >= 6 && hour < 22;
}

// Send single message
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

// Send all (TEST MODE)
async function sendAllMessages() {
  console.log("🚀 TEST MODE ACTIVE: Sending ALL messages...");

  for (let i = 0; i < messages.length; i++) {
    try {
      await bot.sendMessage(CHAT_ID, messages[i]);
      console.log(`✅ Sent test message ${i + 1}`);

      await new Promise(res => setTimeout(res, 1200));

    } catch (error) {
      console.error("❌ Test send error:", error.message);
    }
  }

  console.log("✅ Finished sending all test messages.");
}

// Main start
async function startBot() {
  if (!process.env.BOT_TOKEN) {
    console.error("❌ Missing BOT_TOKEN");
    return;
  }

  if (!CHAT_ID) {
    console.error("❌ Missing CHAT_ID");
    return;
  }

  console.log("🤖 Bot started");
  console.log("TEST_MODE raw:", process.env.TEST_MODE);
  console.log("TEST_MODE active:", TEST_MODE);
  console.log("Messages loaded:", messages.length);
  console.log("UK Hour now:", getUKHour());

  // 🔥 TEST MODE RUNS IMMEDIATELY
  if (TEST_MODE) {
    await sendAllMessages();
    return;
  }

  // Normal mode
  if (isWithinPostingWindow()) {
    await sendMessage();
  } else {
    console.log("⏸ Outside posting window. Waiting...");
  }

  // Loop
  setInterval(async () => {
    if (!isWithinPostingWindow()) {
      console.log("⏸ Outside posting window. Skipping.");
      return;
    }

    await sendMessage();

  }, POST_INTERVAL_MS);
}

startBot();
