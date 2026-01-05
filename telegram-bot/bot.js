require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");

const bot = new Telegraf(process.env.BOT_TOKEN);
const API_BASE = "http://localhost:4000/api";

// simple in-memory state
const userState = {};

/* ============================
   START → LOAD MODULES FROM DB
============================ */
bot.start(async (ctx) => {
  userState[ctx.from.id] = {};

  try {
    const res = await axios.get(
      `${API_BASE}/parameters/modules`
    );

    // convert ["coffee","vending"] → buttons
    const buttons = res.data.map(
      m => [m.charAt(0).toUpperCase() + m.slice(1)]
    );

    await ctx.reply(
      "👋 Welcome!\nChoose module:",
      Markup.keyboard(buttons).resize()
    );
  } catch (err) {
    console.error(err.message);
    ctx.reply("❌ Unable to load modules");
  }
});

/* ============================
   COFFEE MODULE
============================ */
bot.hears("Coffee", async (ctx) => {
  userState[ctx.from.id] = { module: "coffee" };

  const res = await axios.get(
    `${API_BASE}/parameters/categories/coffee`
  );

  const buttons = res.data.map(cat => [cat]);

  ctx.reply(
    "☕ Select Coffee Category",
    Markup.keyboard(buttons).resize()
  );
});

/* ============================
   COFFEE CATEGORY → PARAMETERS
============================ */
bot.hears(async (ctx) => {
  const state = userState[ctx.from.id];
  if (!state || state.module !== "coffee") return;

  const category = ctx.message.text;
  state.category = category;

  try {
    const res = await axios.get(
      `${API_BASE}/parameters/coffee/${category}`
    );

    const buttons = res.data.map(p => [p.label]);

    ctx.reply(
      "Select Option",
      Markup.keyboard(buttons).resize()
    );
  } catch (err) {
    console.error(err.message);
  }
});

/* ============================
   COFFEE PARAMETER → CONTENT
============================ */
bot.hears(async (ctx) => {
  const state = userState[ctx.from.id];
  if (!state || state.module !== "coffee" || !state.category) return;

  const label = ctx.message.text;

  try {
    const paramRes = await axios.get(
      `${API_BASE}/parameters/coffee/${state.category}`
    );

    const selected = paramRes.data.find(p => p.label === label);
    if (!selected) return;

    const res = await axios.get(
      `${API_BASE}/coffee/${state.category}/${selected.parameter}`
    );

    const data = res.data;

    if (data.video) {
      await ctx.replyWithVideo(data.video);
    }

    let msg = `🛠 ${data.title}\n\n${data.description}\n\n`;

    data.steps?.forEach((s, i) => {
      msg += `${i + 1}. ${s}\n`;
    });

    ctx.reply(msg);
  } catch (err) {
    ctx.reply("❌ Data not found");
  }
});

/* ============================
   VENDING MODULE
============================ */
bot.hears("Vending", async (ctx) => {
  userState[ctx.from.id] = { module: "vending" };

  const res = await axios.get(
    `${API_BASE}/parameters/vending`
  );

  const buttons = res.data.map(p => [p.label]);

  ctx.reply(
    "🥤 Select Vending Issue",
    Markup.keyboard(buttons).resize()
  );
});

/* ============================
   VENDING PARAMETER → CONTENT
============================ */
bot.hears(async (ctx) => {
  const state = userState[ctx.from.id];
  if (!state || state.module !== "vending") return;

  const label = ctx.message.text;

  try {
    const paramRes = await axios.get(
      `${API_BASE}/parameters/vending`
    );

    const selected = paramRes.data.find(p => p.label === label);
    if (!selected) return;

    const res = await axios.get(
      `${API_BASE}/vending/${selected.parameter}`
    );

    const data = res.data;

    let msg = `🔧 ${data.title}\n\n${data.description}\n\n`;

    data.steps?.forEach((s, i) => {
      msg += `${i + 1}. ${s}\n`;
    });

    ctx.reply(msg);
  } catch (err) {
    ctx.reply(" Data not found");
  }
});

/* ============================
   LAUNCH
============================ */
bot.launch();
console.log("Telegram Bot running (100% DB driven)");
