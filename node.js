const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/student_attendance', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
const User = mongoose.model('User', UserSchema);

const AttendanceSchema = new mongoose.Schema({
    name: String,
    rollNo: String,
    location: String,
    ipAddress: String,
    status: String,
    date: { type: Date, default: Date.now }
});
const Attendance = mongoose.model('Attendance', AttendanceSchema);

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.json({ message: 'User registered successfully' });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        res.json({ message: 'Login successful' });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
});

app.post('/mark-attendance', async (req, res) => {
    const { name, rollNo, location, ipAddress, status } = req.body;
    const attendance = new Attendance({ name, rollNo, location, ipAddress, status });
    await attendance.save();
    res.json({ message: 'Attendance marked successfully' });
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
