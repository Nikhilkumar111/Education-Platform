import { ApiResponse } from "./ApiResponse.js";

export const sendToken = (user, res, statusCode = 200, message = "Success") => {
  try {
    const token = user.generateToken();
    const isProduction = process.env.NODE_ENV === "production";

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 👇 Sanitized User Data (SAFE)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };


    console.log("Generated Token:", token);

    return res
      .status(statusCode)
      .json(
        new ApiResponse(statusCode, 
          { user: userResponse, token }, 
          message
        )
      );
  } catch (error) {
    console.error("Error in sendToken:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal server error"));
  }
};
