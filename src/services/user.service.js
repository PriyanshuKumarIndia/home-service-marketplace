const bcrypt = require("bcrypt");
const { User, Role, sequelize } = require("../db/models");
const { generateOtp } = require("../utils/public.util");
const { sendEmail } = require("./mail.service");
const redis = require("../utils/redis.util");
const { StatusCodes } = require("../helpers/response.helper");
const { generateToken } = require("../utils/jwt.util");
const { otpPurpose } = require("../constants/public.constant");

const registerUser = async (payload, role = "User") => {
  const transaction = await sequelize.transaction();
  try {
    const { email, password } = payload;
    let { name } = payload;

    // Check duplicate email
    const existingUser = await User.findOne({
      where: { email },
      transaction,
    });

    if (existingUser) {
      await transaction.rollback();
      return {
        code: 0,
        message: `email already registered`,
      };
    }
    //  Get USER role
    const userRole = await Role.findOne({
      where: { name: role.toUpperCase() },
      transaction,
    });

    if (!userRole) {
      await transaction.rollback();
      return {
        code: 0,
        message: `${role} role not found. Please contact admin.`,
      };
    }
    name = name ?? email.split("@")[0]
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await User.create(
      {
        name,
        email,
        password: hashedpassword,
        role_id: userRole.id,
        isActive: false,
      },
      { transaction }
    );

    if (!user) {
      return {
        code: 0,
        message: `${role} registration failed. Please try again.`,
      };
    }

    // Generate OTP
    const otp = generateOtp();
    const otpKey = `otp:${otpPurpose.REGISTRATION}:${user.id}`;

    //  (15 min expiry)
    await redis.set(otpKey, otp, 15 * 60);

    //  Commit transaction
    await transaction.commit();
    //need to send email to user
    sendEmail(email, `Verify your ${role} account`, "otp", {
      username: name,
      otp: otp,
      expiryMinutes: "15",
    });
    return {
      code: 1,
      message: `New ${role} added successfully`,
      data: {
        id: user.id,
        email: user.email,
      },
    };
  } catch (error) {
    console.error(`${role} registeration failed: `, error);
    throw error;
  }
};

const verifyRegistrationOtp = async (payload, purpose = "REGISTRATION") => {
  const { otp, user_id } = payload;
  const key = `otp:${otpPurpose[purpose]}:${user_id}`;
  const storedOtp = await redis.get(key);

  if (!storedOtp) {
    return {
      code: 0,
      message: "Otp expired",
    };
  }

  if (storedOtp != otp) {
    return {
      code: 0,
      message: "Wrong Otp",
    };
  }

  await redis.del(key);

  return {
    code: 1,
    message: "Otp verified successfully",
    data: {
      id: user_id,
    },
  };
};

const toggleUserStatus = async (payload, status) => {
  const { user_id } = payload;
  const user = await User.findOne({
    where: { id: user_id },
  });

  if (!user)
    return {
      code: 0,
      message: "User Not Found",
    };

  if (user.isActive == status)
    return {
      code: 0,
      message: `user already ${status ? "active" : "inactive"}`,
      status: StatusCodes.CONFLICT,
    };

  user.isActive = status;
  await user.save();

  return {
    code: 1,
    message: "Status updated successfully",
    data: {
      id: user_id,
      status: user.isActive,
    },
  };
};

const getVerifiedUsers = async (role = "User") => {
  const userRole = await Role.findOne({
    where: { name: role.toUpperCase() },
  });

  if (!userRole) {
    return {
      code: 0,
      message: `${role} role not found. Please contact admin.`,
    };
  }

  const { count, rows } = await User.findAndCountAll({
    where: { isActive: true, role_id: userRole.id },
    attributes: { exclude: ["password", "deleted_at"] },
  });

  return {
    code: 1,
    message: `${count} verified ${role.toLowerCase()} found`,
    data: rows,
  };
};

const login = async (payload, role = "User") => {
  try {
    const { email, password } = payload;    

    const userRole = await Role.findOne({
      where: { name: role.toUpperCase() },
    });

    if (!userRole) {
      return {
        code: 0,
        message: `${role} role not found. Please contact admin.`,
      };
    }    

    const user = await User.findOne({
      where: { email, role_id: userRole.id },
      attributes: ['id', 'email', 'isActive', 'password'],
    });

    if (!user) {
      return { code: 0, message: "Invalid email" };
    }
    const accountStatus = user.isActive;

    if (!accountStatus) {
      return {
        code: 0,
        message: "Account is inactive. Please verify your email or contact admin.",
        data: null
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { code: 0, message: "Wrong password" };
    }

    const token = generateToken(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
      code: 1,
      message: "Login successful",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        token,
      },
    };
  } catch (error) {
    console.error("Login Service Error:", error);
    throw error;
  }
};

module.exports = {
  registerUser,
  verifyRegistrationOtp,
  toggleUserStatus,
  getVerifiedUsers,
  login
};
