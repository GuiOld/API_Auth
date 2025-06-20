const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarioController');
const auth = require('../middleware/authMiddleware');

router.post('/registrar', controller.registrar);
router.post('/login', controller.login);

// 🔒 Rotas protegidas
router.get('/me', auth, controller.obterUsuario);
router.put('/atualizar', auth, controller.atualizarUsuario);
router.delete('/deletar', auth, controller.deletarUsuario);

module.exports = router;
