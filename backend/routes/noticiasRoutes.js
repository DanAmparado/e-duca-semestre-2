const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/noticias', {
        user: req.session.user,
        title: 'Notícias - E-DUCA',
        noticias: [] // Placeholder
    });
});

module.exports = router;