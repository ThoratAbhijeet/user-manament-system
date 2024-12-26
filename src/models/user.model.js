import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userId: { 
        type: Number, 
        required: true, 
        unique: true 
    },
    Name: { 
        type: String, 
        required: true, 
        maxlength: 50 
    },
    Email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    Age: { 
        type: Number, 
        required: true, 
        min: 18, 
        max: 100 
    },
    Gender: { 
        type: String, 
        required: true, 
        enum: ['male', 'female', 'other'], 
    },
    Address: { 
        type: String, 
        required: true, 
        maxlength: 100 
    },
    mobileNo: { 
        type: String, 
        required: true, 
        minlength: 10, 
        maxlength: 10 
    },
}, { timestamps: true });


// Middleware to increment `userId` before saving the user
userSchema.pre('save', async function(next) {
    if (this.isNew) {
      const lastUser = await this.constructor.findOne().sort({ userId: -1 });
      this.userId = lastUser ? lastUser.userId + 1 : 1; // Start with 1 if no users exist
    }
    next();
  });
  
const User = mongoose.model('users', userSchema);

export { User };
