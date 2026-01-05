require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");

const bot = new Telegraf(process.env.BOT_TOKEN);
const API_BASE = "http://localhost:4000/api";

/* =========================
   SAFE CALLBACK ANSWER
========================= */
async function safeAnswer(ctx) {
  try {
    await ctx.answerCbQuery();
  } catch {}
}

/* =========================
   START → FETCH MODULES
========================= */
bot.start(async (ctx) => {
  try {
    const res = await axios.get(`${API_BASE}/parameters/modules`);

    const buttons = res.data.map(m => [
      Markup.button.callback(m.toUpperCase(), `MODULE|${m}`)
    ]);

    ctx.reply("Select Module", Markup.inlineKeyboard(buttons));
  } catch {
    ctx.reply("Failed to load modules");
  }
});

/* =========================
   MODULE CLICK
========================= */
bot.action(/^MODULE\|/, async (ctx) => {
  await safeAnswer(ctx);

  const module = ctx.callbackQuery.data.split("|")[1];

  try {
    let categories = [];
    try {
      const res = await axios.get(
        `${API_BASE}/parameters/categories/${module}`
      );
      categories = Array.isArray(res.data) ? res.data : [];
    } catch {}

    // Coffee → category flow
    if (categories.length > 0) {
      const buttons = categories.map(c => [
        Markup.button.callback(c, `CAT|${module}|${c}`)
      ]);
      return ctx.reply("Select Category", Markup.inlineKeyboard(buttons));
    }

    // Vending → direct parameter flow
    const res = await axios.get(`${API_BASE}/parameters/${module}`);

    const buttons = res.data.map(p => [
      Markup.button.callback(
        p.label,
        `PARAM|${module}|${p.parameter}`
      )
    ]);

    ctx.reply("Select Parameter", Markup.inlineKeyboard(buttons));

  } catch {
    ctx.reply("Error loading module data");
  }
});

/* =========================
   CATEGORY CLICK (COFFEE)
========================= */
bot.action(/^CAT\|/, async (ctx) => {
  await safeAnswer(ctx);

  const parts = ctx.callbackQuery.data.split("|");
  const module = parts[1];
  const category = parts[2];

  try {
    const res = await axios.get(
      `${API_BASE}/parameters/${module}/${category}`
    );

    const buttons = res.data.map(p => [
      Markup.button.callback(
        p.label,
        `PARAM|${module}|${category}|${p.parameter}`
      )
    ]);

    ctx.reply(
      `Select Parameter (${category})`,
      Markup.inlineKeyboard(buttons)
    );
  } catch {
    ctx.reply("Failed to load category data");
  }
});

/* =========================
   PARAMETER CLICK (FINAL FIX)
========================= */
bot.action(/^PARAM\|/, async (ctx) => {
  await safeAnswer(ctx);

  const parts = ctx.callbackQuery.data.split("|");
  const module = parts[1];
  let url;

  // Coffee (with category)
  if (parts.length === 4) {
    const category = parts[2];
    const parameter = parts[3];
    url = `${API_BASE}/${module}/${category}/${parameter}`;
  }
  // Vending (no category)
  else {
    const parameter = parts[2];
    url = `${API_BASE}/${module}/${parameter}`;
  }

  try {
    const res = await axios.get(url);
    const data = res.data;

    if (!data) return ctx.reply("No data found");

    let msg = `${data.title}\n\n${data.description}\n\nSteps:\n`;
    data.steps.forEach((s, i) => {
      msg += `${i + 1}. ${s}\n`;
    });

    await ctx.reply(msg);
    if (data.video) {
      await ctx.replyWithVideo(data.video);
    }

  } catch {
    ctx.reply("Failed to load content");
  }
});

/* =========================
   LAUNCH
========================= */
bot.launch();
console.log("Telegram Bot Running");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
