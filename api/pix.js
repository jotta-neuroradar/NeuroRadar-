const { MercadoPagoConfig, Payment } = require('mercadopago');

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

const payment = new Payment(client);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!process.env.MP_ACCESS_TOKEN) {
        return res.status(500).json({ error: 'Token do Mercado Pago não configurado na Vercel.' });
    }

    try {
        const body = {
            transaction_amount: 4.90,
            description: 'NeuroRadar - Laudo Detalhado TDAH',
            payment_method_id: 'pix',
            payer: {
                email: 'cliente@neuroradar.com.br',
                first_name: 'Cliente',
                last_name: 'NeuroRadar'
            }
        };

        const result = await payment.create({ body });

        return res.status(200).json({
            id: result.id,
            qr_code: result.point_of_interaction.transaction_data.qr_code,
            qr_code_base64: result.point_of_interaction.transaction_data.qr_code_base64,
            status: result.status
        });
    } catch (error) {
        console.error('Mercado Pago Error:', error);
        const detailedError = error.message || 'Erro desconhecido na API do Mercado Pago';
        return res.status(500).json({ error: 'Erro ao gerar pagamento PIX', details: detailedError });
    }
};
