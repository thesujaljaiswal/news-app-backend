import { User } from "../models/user.model.js";
import { News } from "../models/news.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { options } from "../constants.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating asscess and refreah token"
    );
  }
};

const registerUser = asynchandler(async (req, res) => {
  const { username, email, fullName, password, categoryIntrested } = req.body;

  if (
    [username, email, fullName, password].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const ifUserExisted = await User.findOne({
    $or: [{ username }],
  });

  if (ifUserExisted) {
    throw new ApiError(400, "User with that username already exists");
  }

  const splitCategories = categoryIntrested.split(",");

  const user = await User.create({
    fullName,
    password,
    username: username.toLowerCase(),
    email,
    categoryIntrested: splitCategories.map((item) => item.toLowerCase().trim()),
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  res
    .status(201)
    .json(new ApiResponse(200, createdUser, "Created user Succesfully"));
});

const loginUser = asynchandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    throw new ApiError(401, "Username is required");
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(401, "User doesnot exists");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password doesnot match");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, refreshToken, accessToken },
        "User logged in succesfully"
      )
    );
});

const logoutUser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const deleteUserAccount = asynchandler(async (req, res) => {
  await News.deleteMany({ author: req.user.username });
  await User.findByIdAndDelete(req.user._id);
  res
    .status(201)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(201, {}, "Deleted user successfully"));
});

const getUserProfileWithNews = asynchandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "User Does not exist");
  }

  const fullProfile = await User.aggregate([
    {
      $match: {
        _id: req.user._id,
      },
    },
    {
      $lookup: {
        from: "news",
        localField: "_id",
        foreignField: "authorId",
        as: "newsData",
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        email: 1,
        fullName: 1,
        newsData: 1,
      },
    },
  ]);

  if (!fullProfile?.length) {
    throw new ApiError(404, "User doesnot exist");
  }

  res
    .status(200)
    .json(new ApiResponse(200, fullProfile[0], "User found successfully"));
});

const updateUserDetails = asynchandler(async (req, res) => {
  const { email, username, fullName, categoryIntrested } = req.body;

  if (!email || !username || !fullName || !categoryIntrested) {
    throw new ApiError(400, "All fields are required");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { email, username, fullName, categoryIntrested },
    },
    { new: true }
  ).select("-password");

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User details updated successfully")
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  deleteUserAccount,
  getUserProfileWithNews,
  updateUserDetails,
};
