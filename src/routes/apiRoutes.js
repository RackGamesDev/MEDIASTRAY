import express from 'express';

const router = express.Router();

router.get("/prueba", (req, res) => {
    res.json({ message: `Hello, World! Processed` });
});

export default router;