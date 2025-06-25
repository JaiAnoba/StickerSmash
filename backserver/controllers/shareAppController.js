const ShareApp = require('../models/ShareApp');

exports.createShare = async (req, res) => {
  try {
    const share = new ShareApp(req.body);
    await share.save();
    res.status(201).json(share);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getShares = async (req, res) => {
  try {
    const shares = await ShareApp.find();
    res.json(shares);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getShare = async (req, res) => {
  try {
    const share = await ShareApp.findById(req.params.id);
    if (!share) return res.status(404).json({ error: 'Not found' });
    res.json(share);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateShare = async (req, res) => {
  try {
    const share = await ShareApp.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!share) return res.status(404).json({ error: 'Not found' });
    res.json(share);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteShare = async (req, res) => {
  try {
    const share = await ShareApp.findByIdAndDelete(req.params.id);
    if (!share) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
