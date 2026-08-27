require('dotenv').config();
const { Telegraf } = require('telegraf');


const bot = new Telegraf(process.env.BOT_TOKEN);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Har bir user uchun savol bosqichi
const userState = {};

const questions = [
  "Salom! Qiziqayotgan mahsulot yoki xizmat haqida aytib bering?",
  "Byudjetingiz taxminan qancha?",
  "Qachon kerak — tez yoki vaqt bor?"
];

bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const text = ctx.message.text;

  // State yo'q bo'lsa — boshlash
  if (!userState[userId]) {
    userState[userId] = { step: 0, answers: [] };
  }

  const state = userState[userId];

  // Javobni saqla
  if (state.step > 0) {
    state.answers.push(text);
  }

  // Savollar tugadimi
  if (state.step >= questions.length) {
    // Sotuvchiga xulosa yuber
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
    
    // Stateni tozala
    delete userState[userId];
    return;
  }

  // Keyingi savolni yuber
  await ctx.reply(questions[state.step]);
  state.step++;
});

bot.launch();
console.log('Bot ishga tushdi ✅');