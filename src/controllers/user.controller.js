import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'

// Validation Functions
const validateName = (Name) => {
    if (typeof Name !== "string" || Name.length > 50) {
        return false;
    }
    return true;
}

const validateEmail = (Email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(Email);
}

const validateAge = (Age) => {
    if (typeof Age !== 'number' || Age < 18 || Age > 100) {
        return false;
    }
    return true;
}

const validateGender = (Gender) => {
    const genders = ['male', 'female', 'other'];
    const lowerCaseGender = Gender.toLowerCase();
    return genders.includes(lowerCaseGender);
}

const validateAddress = (Address) => {
    if (typeof Address !== "string" || Address.length > 100) {
        return false; // Fixed to check for length greater than 100
    }
    return true;
}

const validateMobileNo = (mobileNo) => {
    if (typeof mobileNo !== 'string' || mobileNo.length !== 10) { // Change from 'number' to 'string' to handle leading zeros
        return false;
    }
    return true;
}

const createUser = async (req, res) => {
    const { Name, Email, Age, Gender, Address, mobileNo } = req.body;

    // Check all fields are non-empty
    if ([Name, Email, Age, Gender, Address, mobileNo].some(field => field === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Name validation
    if (!validateName(Name)) {
        throw new ApiError(400, 'Name must be a string and no longer than 50 characters');
    }

    // Email validation
    if (!validateEmail(Email)) {
        throw new ApiError(400, 'Invalid email');
    }

    // Age validation
    if (!validateAge(Age)) {
        throw new ApiError(400, "Age must be between 18 and 100");
    }

    // Gender validation
    if (!validateGender(Gender)) {
        throw new ApiError(400, "Gender must be male, female, or other");
    }

    // Address validation
    if (!validateAddress(Address)) {
        throw new ApiError(400, "Address must be no more than 100 characters long");
    }

    // Mobile validation
    if (!validateMobileNo(mobileNo)) {
        throw new ApiError(400, "Mobile number must be 10 digits");
    }

    // Check if user already exists
    const isUserExist = await User.findOne({ Email });
    if (isUserExist) {
        throw new ApiError(404, "User with this email already exists");
    }

    // Find the last userId to increment for the new user
    const lastUser = await User.findOne().sort({ userId: -1 });
    const userId = lastUser ? lastUser.userId + 1 : 1; // Start with 1 if no users exist

    // Creating user with the auto-incremented userId
    const user = await User.create({
        userId,  // Assign auto-incremented userId
        Name,
        Email,
        Age,
        Gender,
        Address,
        mobileNo,
    });

    if (!user) {
        throw new ApiError(500, "Something went wrong while creating the user");
    }

    // Return response
    return res.status(200).json(new ApiResponse(200, user, "User created successfully"));
};

//get user by id
const readUser = async (req, res) => {
    const { userId } = req.params;  // Retrieve userId from request parameters

    // Find the user by the 'userId' field (not by _id)
    const user = await User.findOne({ userId });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Return the user data in the response
    return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
};

//get users list
const readUsers = async (req, res) => {
    // Fetch all users (no userId parameter required)
    const users = await User.find();

    if (!users || users.length === 0) {
        throw new ApiError(404, "No users found");
    }

    // Return all users in the response
    return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
};

const updateUser = async (req, res) => {
    const { userId } = req.params; // Retrieve userId from request parameters
    const { Name, Age, mobileNo, Address, Gender } = req.body;

    // Validation - Non-empty fields
    if ([Name, Age, Address, mobileNo, Gender].some(field => field === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Name validation
    if (!validateName(Name)) {
        throw new ApiError(400, 'Name must be a string and no longer than 50 characters');
    }

    // Age validation
    if (!validateAge(Age)) {
        throw new ApiError(400, "Age must be between 18 and 100");
    }

    // Gender validation
    if (!validateGender(Gender)) {
        throw new ApiError(400, "Gender must be male, female, or other");
    }

    // Address validation
    if (!validateAddress(Address)) {
        throw new ApiError(400, "Address must be no more than 100 characters long");
    }

    // Mobile validation
    if (!validateMobileNo(mobileNo)) {
        throw new ApiError(400, "Mobile number must be 10 digits");
    }

    // Check if user exists by userId
    const user = await User.findOne({ userId });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Update the user by userId
    const updatedUser = await User.findOneAndUpdate(
        { userId }, // Use userId to find the user
        {
            $set: { Name, Age, Address, mobileNo, Gender } // Set updated values
        },
        { new: true } // Return the updated user
    );

    if (!updatedUser) {
        throw new ApiError(500, "Error while updating user");
    }

    return res.status(200).json(new ApiResponse(200, updatedUser, "User details updated successfully"));
};


const deleteUser = async (req, res) => {
    const { userId } = req.params;  // Retrieve userId from request parameters

    // Check if user exists by userId
    const user = await User.findOne({ userId });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Delete user by userId
    const isDeleted = await User.findOneAndDelete({ userId });
    if (!isDeleted) {
        throw new ApiError(500, "Error while deleting user");
    }

    // Return response after deletion
    return res.status(200).json(new ApiResponse(200, {}, "User deleted successfully"));
};


export {
    createUser,
    readUser,
    updateUser,
    deleteUser,
    readUsers
}
