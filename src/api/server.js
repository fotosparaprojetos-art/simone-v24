'use strict';

const express = require('express');
const rateLimit = require('express-rate-limit');
const { calcular } = require('../core/engine');
const { obterDevolutiva } = require('../library/index');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '32kb' }));

const limiter = rateLimit({
  windowMs: 60000,
  max: 30
});

app.get('/health', (_, res) => {
  res.json({ status: 'ok', versao: 'V24' });
});

app.post('/avaliar', limiter, (req, res) => {
  try {
    const respostas = req.body.respostas;

    const resultado = calcular({
      respostas,
      historico: []
    });

    const devolutiva = obterDevolutiva(resultado);

    res.json(devolutiva);

  } catch (e) {
    res.status(400).json({ erro: 'payload inválido' });
  }
});

app.listen(PORT, () => {
  console.log(`SiMone V24 rodando na porta ${PORT}`);
});
