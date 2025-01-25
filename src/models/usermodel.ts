import mongoose from 'mongoose';

interface UserDocument extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: Date;
  location?: string;
  bio?: string;
  interests?: string[];
  preferences?: {
    gender: ('Male' | 'Female' | 'Other')[];
    ageRange: number[];
    maxDistance?: number;
  };
  profilePicture?: string;
  matches?: mongoose.Types.ObjectId[];
  verified: boolean;
  premium: {
    isActive: boolean;
    expiryDate?: Date;
  };
  otp?: string;
  otpExpiry?: Date;
  
    postLinks?: string[]; // Array of post-related links
  
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    dateOfBirth: { type: Date, required: true },
    location: { type: String },
    bio: { type: String, maxlength: 500 },
    interests: { type: [String] },
    preferences: {
      type: new mongoose.Schema(
        {
          gender: { type: [String], enum: ['Male', 'Female', 'Other'], required: false },
          ageRange: {
            type: [Number],
            validate: {
              validator: (val: number[]) => val.length === 2 && val[0] < val[1],
              message: 'Age range must contain two numbers, with the first being smaller than the second.',
            },
            required: false,
          },
          maxDistance: { type: Number, required: false },
        },
        { _id: false }
      ),
    },
    profilePicture: { type: String },
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    verified: { type: Boolean, default: false },
    premium: {
      isActive: { type: Boolean, default: false },
      expiryDate: { type: Date },
    },
    otp: { type: String },
    otpExpiry: { type: Date },
  
      postLinks: { type: [String] }, // Array of strings for storing links
  
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);
export default User;
