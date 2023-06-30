import express from "express";
import Transaction from "./classes/transaction.class";
import User from "./classes/user.class";
import { transacoes, usuarios } from "./database";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.listen(8080, () => console.log("Servidor iniciado"));
app.get("/", (request, response) => {
  return response.send("OK");
});

app.post("/users", (request, response) => {
  const { name, cpf, email, age } = request.body;

  if (usuarios.some((usuario) => usuario.cpf === cpf)) {
    return response.status(400).json({
      message: "Já existe um usuário cadastrado com esse cpf.",
    });
  }
  const novoUsuario = new User(name, cpf, email, age);

  usuarios.push(novoUsuario);

  return response.json({
    mensagem: "adicionado",
    dados: usuarios,
  });
});

app.get("/users/:id", (request, response) => {
  const { id } = request.params;

  if (!usuarios.some((usuario) => usuario.id === id)) {
    return response.status(404).json({
      mensagem: `Nenhum usuário encontrado com o id: ${id}`,
    });
  }
  const usuarioUnico = usuarios.find((usuario) => usuario.id === id);

  return response.status(200).json({
    mensagem: "Usuário encontrado.",
    dados: usuarioUnico?.mostrarUsuario(),
  });
});

app.get("/users", (request, response) => {
  const { name, email, cpf } = request.query;

  if (!name && !email && !cpf) {
    return response.json({
      mensagem: "Sem parametros",
      dados: usuarios,
    });
  }
  if (name) {
    const filtro = usuarios.find((usuario) => usuario.name === name);
    return response.status(200).json({
      mensagem: "Filtrado por name",
      dados: filtro?.mostrarUsuario(),
    });
  }

  if (email) {
    const filtro = usuarios.find((usuario) => usuario.email === email);
    return response.status(200).json({
      mensagem: "Filtrado por email",
      dados: filtro?.mostrarUsuario(),
    });
  }

  if (cpf) {
    const filtro = usuarios.find((usuario) => usuario.cpf === cpf);
    return response.status(200).json({
      mensagem: "Filtrado por cpf",
      dados: filtro?.mostrarUsuario(),
    });
  }
  return;
});

app.put("/users/:id", (request, response) => {
  const { id } = request.params;
  const { email, age } = request.body;

  const idBuscado = usuarios.findIndex((usuario) => usuario.id === id);

  const usuarioAntigo = usuarios[idBuscado];
  usuarios[idBuscado] = {
    ...usuarioAntigo,
    email: email || usuarioAntigo.email,
    age: age || usuarioAntigo.age,
  };

  return response.status(200).json({
    mensagem: "Usuário atualizado com sucesso",
    dados: usuarios[idBuscado],
  });
});

app.delete("/users/:id", (request, response) => {
  const { id } = request.params;
  const indiceEncontrado = usuarios.findIndex((usuario) => usuario.id === id);
  const [usuarioExcluido] = usuarios.splice(indiceEncontrado, 1);

  return response.status(200).json({
    mensagem: "Usuário excluido.",
    dadoExcluido: usuarioExcluido,
  });
});

app.post("/user/:userId/transactions", (request, response) => {
  const { title, value, type } = request.body;
  const { userId } = request.params;

  const userBuscado = usuarios.find((usuario) => usuario.id === userId);
  const novaTransacao = new Transaction(title, value, type);

  userBuscado?.transactions.push(novaTransacao);

  return response.status(200).json({
    mensagem: "Transação adicionada",
    dados: userBuscado,
  });
});

app.get("/user/:userId/transactions/:id", (request, response) => {
  const { userId, id } = request.params;
  const indiceEncontrado = transacoes.findIndex(
    (transacao) => transacao.id === id
  );

  if (userId) {
    return response.status(200).json({
      mensagem: "Boa",
      dados: transacoes[indiceEncontrado],
    });
  }
});

app.get("/users/:userId/transactions", (request, response) => {
  const { userId } = request.params;
  const { titulo, tipo } = request.query;
  const listaTransacoes = usuarios.find(
    (usuario) => usuario.id === userId
  )?.transactions;

  if (titulo) {
    const filtro = listaTransacoes?.filter((f) => f.title === titulo);
    return response.json({
      mensagem: "Filtrado por titulo",
      dados: filtro,
    });
  }

  if (tipo) {
    const filtro = listaTransacoes?.filter((f) => f.type === tipo);
    return response.json({
      mensagem: "Filtrado por tipo",
      dados: filtro,
    });
  }
});

app.put("/users/:userId/transactions/:id", (request, response) => {
  const { userId, id } = request.params;
  const { title, value, type } = request.body;

  const indiceEncontrado = transacoes.findIndex(
    (transacao) => transacao.id === id
  );
  const transacaoAntiga = transacoes[indiceEncontrado];
  transacoes[indiceEncontrado] = {
    ...transacaoAntiga,
    title: title || transacaoAntiga.title,
    value: value || transacaoAntiga.value,
    type: type || transacaoAntiga.type,
  };

  return response.status(200).json({
    mensagem: "Transação atualizada com sucesso.",
    itemAtualizado: transacoes[indiceEncontrado],
  });
});

app.delete("/users/:userId/transactions/:id", (request, response) => {
  const { userId, id } = request.params;
  const indiceEncontrado = transacoes.findIndex(
    (transacao) => transacao.id === id
  );
  const [dadoExcluido] = transacoes.splice(indiceEncontrado, 1);

  return response.status(200).json({
    mensagem: "Transação excluida com sucesso.",
    itemRemovido: dadoExcluido,
  });
});
