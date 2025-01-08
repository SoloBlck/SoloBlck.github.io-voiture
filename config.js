// Cette fonction sera utilisée côté serveur uniquement
const getWebhookUrl = () => {
    return process.env.WEBHOOK_URL;
};

module.exports = {
    getWebhookUrl
};
