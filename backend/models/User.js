// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Library for hashing passwords

const UserSchema = new mongoose.Schema({
    // Personal Information
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        // Prevents the password from being returned in query results by default
        select: false 
    },
    // Reference to constants/roles.js for allowed values
    role: {
        type: String,
        enum: ['ADMIN', 'DRIVER', 'PARENT', 'COORDINATOR'], 
        default: 'PARENT'
    },
    // Driver-specific field
    busId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: function() { return this.role === 'DRIVER'; } // Required only if role is 'DRIVER'
    },
    // Parent-specific field (to track which bus/route their child is on)
    childBusId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
    },
    // Optional tokens for password reset functionality
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, { 
    timestamps: true 
});

// --- BEST PRACTICE: PASSWORD HASHING MIDDLEWARE ---

// Encrypt password using bcrypt before saving the user document
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        // If password field hasn't changed, skip hashing
        next();
    }
    // Generate a salt (a random string to ensure unique hashes)
    const salt = await bcrypt.genSalt(10); 
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// --- BEST PRACTICE: METHOD FOR PASSWORD MATCHING ---

// Method to compare the entered password with the hashed password in the database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    // Compares the plaintext password with the hashed password
    return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', UserSchema);