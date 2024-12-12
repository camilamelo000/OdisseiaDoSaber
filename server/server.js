const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173"], 
};
app.use(cors(corsOptions));


app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'seu-email@gmail.com', 
    pass: 'sua-senha-ou-token-de-aplicativo', 
  },
});


const sendEmail = (email, apto) => {
  const subject = apto
    ? "Você está apto para receber a doação do livro!"
    : "Você não está apto para receber a doação deste livro.";
  const body = apto
    ? "Parabéns! Você está apto para receber a doação do livro baseado na sua renda per capita."
    : "Infelizmente, você não está apto para a doação do livro devido à sua renda.";

  const mailOptions = {
    from: 'seu-email@gmail.com', 
    to: email, 
    subject: subject,
    text: body,
  };

  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erro ao enviar o e-mail:", error);
      return;
    }
    console.log("E-mail enviado:", info.response);
  });
};

function lerComentarios() {
  try {
    const data = fs.readFileSync(path.join(__dirname, '..', 'back', 'Comentario.json'), 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Erro ao ler o arquivo de comentários:', err);
    return []; 
  }
}

function salvarComentarios(comentarios) {
  fs.writeFileSync(path.join(__dirname, '..', 'back', 'Comentario.json'), JSON.stringify(comentarios, null, 2));
}

function lerLivros() {
  try {
    const data = fs.readFileSync(path.join(__dirname, '..', 'back', 'Livro.json'), 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Erro ao ler o arquivo de livros:', err);
    return []; 
  }
}

app.get("/api/comentarios", (req, res) => {
  const comentarios = lerComentarios(); 
  res.json(comentarios); 
});

app.post('/api/comentarios', (req, res) => {
  const { Comentarios, Estrelas, IdLivro, IdUsuario } = req.body;

  const novoComentario = {
    IdComentario: Date.now(), 
    Comentarios,
    Estrelas,
    IdLivro,
    IdUsuario,
    DataComentario: new Date().toISOString()
  };

  const comentariosExistentes = lerComentarios(); 
  comentariosExistentes.push(novoComentario); 
  salvarComentarios(comentariosExistentes); 

  res.status(201).json(novoComentario); 
});

app.get("/api", (req, res) => {
  const livros = lerLivros(); 
  res.json(livros); 
});

app.get("/api/:productId", (req, res) => {
  const { productId } = req.params; 
  const livros = lerLivros(); 
  const livro = livros.find(livro => livro.IdLivro == productId); 

  if (!livro) {
    return res.status(404).json({ message: "Livro não encontrado" });
  }

  res.json(livro); 
});


app.listen(8080, () => {
  console.log("Server Started on port 8080");
});
