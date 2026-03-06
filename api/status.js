const { MercadoPagoConfig, Payment } = require('mercadopago');

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

const payment = new Payment(client);

module.exports = async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'ID do pagamento não fornecido' });
    }

    try {
        const result = await payment.get({ id });

        return res.status(200).json({
            status: result.status,
            status_detail: result.status_detail
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao verificar status do pagamento' });
    }
};
