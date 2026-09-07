const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const LOOTLABS_API_KEY = "cf6bf3061d4cc50e7b682c55be869cd436731a0252b9e3ddedd40efae5f2b83e";
const PLATOBOOST_ID = "18296";

app.post('/api/verify-lootlabs', async (req, res) => {
    const { key } = req.body;
    if (!key) return res.status(400).json({ valid: false, error: "Llave no proporcionada" });

    try {
        const response = await axios.get(`https://creators.lootlabs.gg/api/public/content_locker`, {
            headers: {
                'Authorization': `Bearer ${LOOTLABS_API_KEY}`
            },
            params: { key: key }
        });

        if (response.data && response.data.success) {
            return res.json({ valid: true });
        }
        return res.status(401).json({ valid: false });
    } catch (error) {
        return res.status(500).json({ valid: false, error: "Error en servidor LootLabs" });
    }
});

app.post('/api/verify-platoboost', async (req, res) => {
    const { key, user_id } = req.body;
    if (!key || !user_id) return res.status(400).json({ valid: false, error: "Datos incompletos" });

    try {
        const response = await axios.get(`https://api.platoboost.com/public/whitelist/${PLATOBOOST_ID}`, {
            params: {
                key: key,
                user_id: user_id
            }
        });

        if (response.data && response.data.valid) {
            return res.json({ valid: true });
        }
        return res.status(401).json({ valid: false });
    } catch (error) {
        return res.status(500).json({ valid: false, error: "Error en servidor Platoboost" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
