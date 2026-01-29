// User Model - Defines the structure of user data in MongoDB
//ye standerd code hai user model ka jisme user ka data store hota hai database me....like kisi bhi schema ko banane ka
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User Schema (structure of user documents)
//mongoose.schema ka use karke hum ek naya schema bana rahe hai jisme user ke fields define kar rahe hai
const userSchema = new mongoose.Schema(
    {
        // User's full name
        name: {
            type: String,
            required: [true, 'Please provide your name'],
            trim: true,
        },

        // User's email address (must be unique)
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        //ye terminal pr error dega agar email valid nhi hoga..terminal pr command se check kr skte hai..
        // User's password (will be hashed before saving)
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'Password must be at least 6 characters'],
        },

        // 2 role h Buyer or Seller
        role: {
            type: String,
            enum: ['Buyer', 'Seller'],
            required: [true, 'Please select a role'],
        },

        // Profile photo (base64 or URL)
        profilePhoto: {
            type: String,
            default: '',
        },

        // Phone number (optional initially, required for orders)
        phone: {
            type: String,
            default: '',
            trim: true,
        },

        // Address for delivery
        address: {
            street: {
                type: String,
                default: '',
            },
            city: {
                type: String,
                default: '',
            },
            state: {
                type: String,
                default: '',
            },
            pincode: {
                type: String,
                default: '',
            },
        },

        // Profile completion flag
        profileCompleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        // Automatically add createdAt and updatedAt timestamps
        timestamps: true,
    }
);

// Middleware: Hash password before saving to database
// This runs automatically before a new user is created
userSchema.pre('save', async function (next) {
    // mera password saltvalue k through hash hoga
    if (!this.isModified('password')) {
        return next();
    }
    //this function is used for map filter or reduce
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password with the salt
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare entered password with hashed password in database
// Returns krega true if passwords match, false otherwise
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
//salt value se security badh jati hai...
//hashing se password secure ho jata hai database me store hone ke baad
//bcryptjs ek library hai jo hashing ke liye use hoti hai