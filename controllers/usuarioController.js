const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registrar = async (req, res) => {
  const { nome, email, senha } = req.body;
  const senhaHash = bcrypt.hashSync(senha, 10);
  try {
    const usuario = new Usuario({ nome, email, senhaHash });
    await usuario.save();
    res.status(201).json({ mensagem: 'Usuário criado' });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });

    const senhaValida = bcrypt.compareSync(senha, usuario.senhaHash);
    if (!senhaValida) return res.status(401).json({ mensagem: 'Senha incorreta' });

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.obterUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuarioId).select('nome email');
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao obter dados do usuário' });
  }
};

exports.atualizarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const updateData = { nome, email };

    if (senha) {
      updateData.senhaHash = bcrypt.hashSync(senha, 10);
    }

    const usuarioAtualizado = await Usuario.findByIdAndUpdate(
      req.usuarioId,
      updateData,
      { new: true, select: 'nome email' }
    );

    if (!usuarioAtualizado) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    res.json({ mensagem: 'Usuário atualizado com sucesso', usuario: usuarioAtualizado });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao atualizar usuário' });
  }
};

exports.deletarUsuario = async (req, res) => {
  try {
    const resultado = await Usuario.findByIdAndDelete(req.usuarioId);
    if (!resultado) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    res.json({ mensagem: 'Usuário deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao deletar usuário' });
  }
};
