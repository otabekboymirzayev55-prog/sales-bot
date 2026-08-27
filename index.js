require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

const userState = {};

const questions = [
  "Salom! Qiziqayotgan mahsulot yoki xizmat haqida aytib bering?",
  "Byudjetingiz taxminan qancha?",
  "Qachon kerak — tez yoki vaqt bor?"
];

bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const text = ctx.message.text;

  if (!userState[userId]) {
    userState[userId] = { step: 0, answers: [] };
  }

  const state = userState[userId];

  if (state.step > 0) {
    state.answers.push(text);
  }

  if (state.step >= questions.length) {
    const summary = `
🔥 Yangi Lead!
👤 Ismi: ${ctx.from.first_name}
📱 Username: @${ctx.from.username || 'yo\'q'}

📝 Xohlaydi: ${state.answers[0]}
💰 Byudjet: ${state.answers[1]}
⏰ Vaqt: ${state.answers[2]}
    `;

    await bot.telegram.sendMessage(process.env.SALES_CHAT_ID, summary);
    await ctx.reply("Rahmat! Tez orada mutaxassisimiz siz bilan bog'lanadi. 🙏");
    delete userState[userId];
    return;
  }

  await ctx.reply(questions[state.step]);
  state.step++;
});

bot.launch();
console.log('Bot ishga tushdi ✅');