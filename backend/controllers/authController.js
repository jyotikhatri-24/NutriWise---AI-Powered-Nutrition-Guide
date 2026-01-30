import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc    Register User
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { 
            fullname, 
            email, 
            phoneNumber, 
            password,
            age,
            gender,
            weight,
            height,
            dietaryPreferences,
            allergies,
            healthConditions,
            activityLevel
        } = req.body;

        // Required fields validation
        if (!fullname || !email || !phoneNumber || !password) {
            return res.status(400).json({
                message: "Required fields are missing",
                success: false
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with all fields
        const user = await User.create({
    fullname,
    email,
    phoneNumber,
    password: hashedPassword,
    age,
    gender,
    height,
    weight,
    activityLevel,
    allergies,
    dietaryPreferences: dietaryPreferences || '',
    healthGoals: healthConditions || ''
});


        // Create JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Set JWT as httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        // Return user data without password
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            message: "Error creating account",
            success: false
        });
    }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false
            });
        }

        // Find user and exclude password from response
        let user = await User.findOne({ email }).select('-password');
        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials",
                success: false,
            });
        }

        // Get user with password for comparison
        const userWithPassword = await User.findOne({ email });
        const isPasswordMatch = await bcrypt.compare(password, userWithPassword.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
                success: false,
            });
        }

        const tokenData = {
            userId: user._id
        };

        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.status(200)
            .cookie("token", token, { 
                maxAge: 1 * 24 * 60 * 60 * 1000, 
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict' 
            })
            .json({
                message: `Welcome back ${user.fullname}`,
                user,
                success: true
            });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            message: "Error during login",
            success: false
        });
    }
};

// @desc    Logout User
// @route   GET /api/auth/logout
// @access  Private
export const logoutUser = (req, res) => {
    try {
        return res.status(200)
            .cookie("token", "", { 
                maxAge: 0,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            })
            .json({
                message: "Logged out successfully",
                success: true
            });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            message: "Error during logout",
            success: false
        });
    }
};