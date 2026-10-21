
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Register a new user
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check that all required fields were provided
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: 'Name, email, and password are required.',
      });
    }

    // 2. Validate the password length
    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long.',
      });
    }

    // 3. Normalize the user's details
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // 4. Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create the user in MongoDB
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    // 6. Return only safe user information
    return res.status(201).json({
      message: 'Registration successful.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    // Handle an email that already exists
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'An account with this email already exists.',
      });
    }

    // Pass unexpected errors to the error-handling middleware
    next(error);
  }
};

// login auth controller


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate the submitted credentials
    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: 'Email and password are required.',
      });
    }

    // 2. Find the user and explicitly include the password hash
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select('+password');

    // 3. Reject unknown emails or incorrect passwords
    // Use the same message for both cases.
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    // 4. Create a login session
    req.session.userId = user._id.toString();

    // 5. Send the safe user details after the session is saved
    req.session.save((error) => {
      if (error) {
        return next(error);
      }

      return res.status(200).json({
        message: 'Login successful.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    });
  } catch (error) {
    next(error);
  }
};



const getMe = async (req, res, next) => {
  try {
    // Check whether a user ID exists in the session
    if (!req.session.userId) {
      return res.status(401).json({
        message: 'You are not logged in.',
      });
    }

    // Find the account associated with this session
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(401).json({
        message: 'User account not found. Please log in again.',
      });
    }

    // Return safe user details
    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};




const logout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie('recipebox.sid', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });

    return res.status(200).json({
      message: 'Logout successful.',
    });
  });
};



module.exports = { register , login , getMe , logout};
