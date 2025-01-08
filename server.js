require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Route pour soumettre le rendez-vous
app.post('/submit-appointment', async (req, res) => {
    try {
        const formData = req.body;
        const webhookUrl = process.env.WEBHOOK_URL;

        // Création de l'embed Discord
        const embed = {
            title: "Nouvelle demande de rendez-vous",
            color: 0x0099ff,
            fields: [
                {
                    name: "Service",
                    value: formData.service,
                    inline: true
                },
                {
                    name: "Client",
                    value: formData.name,
                    inline: true
                },
                {
                    name: "Email",
                    value: formData.email,
                    inline: true
                },
                {
                    name: "Téléphone",
                    value: formData.phone,
                    inline: true
                },
                {
                    name: "Date souhaitée",
                    value: `${formData.date} à ${formData.time}`,
                    inline: true
                }
            ],
            footer: {
                text: "Pacific Lex - Système de rendez-vous"
            },
            timestamp: new Date().toISOString()
        };

        if (formData.message) {
            embed.fields.push({
                name: "Message",
                value: formData.message
            });
        }

        // Envoi au webhook Discord
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                embeds: [embed]
            })
        });

        if (!response.ok) {
            throw new Error('Webhook request failed');
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
