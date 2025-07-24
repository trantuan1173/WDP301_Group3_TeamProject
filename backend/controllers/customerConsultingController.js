const CustomerConsulting = require("../models/customerConsultingModel");

const createCustomerConsulting = async (req, res) => {
    try {
        const { name, email, phone, content } = req.body;
        const customerConsulting = new CustomerConsulting({
            name,
            email,
            phone,
            content,
        });
        await customerConsulting.save();
        res.status(201).json(customerConsulting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAllCustomerConsulting = async (req, res) => {
    try {
        const customerConsultings = await CustomerConsulting.find();
        res.status(200).json(customerConsultings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateCustomerConsulting = async (req, res) => {
    try {
        const customerConsulting = await CustomerConsulting.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        res.status(200).json(customerConsulting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

    const deleteCustomerConsulting = async (req, res) => {
    try {
        const customerConsulting = await CustomerConsulting.findByIdAndDelete(req.params.id);
        res.status(200).json(customerConsulting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createCustomerConsulting,
    getAllCustomerConsulting,
    updateCustomerConsulting,
    deleteCustomerConsulting,
}
