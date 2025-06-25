const Chatbot = require('../models/Chatbot');

exports.createChat = async (req, res) => {
  try {
    const chat = new Chatbot(req.body);
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getChats = async (req, res) => {
  try {
    const chats = await Chatbot.find();
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getChat = async (req, res) => {
  try {
    const chat = await Chatbot.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: 'Not found' });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateChat = async (req, res) => {
  try {
    const chat = await Chatbot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!chat) return res.status(404).json({ error: 'Not found' });
    res.json(chat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chatbot.findByIdAndDelete(req.params.id);
    if (!chat) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
