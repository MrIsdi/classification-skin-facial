import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const groq = new Groq();

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/chat", async (req, res) => {
  const { skin } = req.body;
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Kamu adalah ahli kulit. Berikan 8 rekomendasi perawatan dari tipe kulit wajah ${skin} secara spesifik dalama bahasa indonesia`,
      },
    ],
    model: "llama3-8b-8192",
    temperature: 1,
    max_tokens: 3072,
    top_p: 1,
    stream: false,
    stop: null,
  });

  res.json(chatCompletion.choices[0].message.content);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;
