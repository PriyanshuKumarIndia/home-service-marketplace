const crypto =require("node:crypto")

// utils/passwordGenerator.js

const generatePassword = (length = 8) => {
  if (length < 8) {
    throw new Error("Password length must be at least 8 characters");
  }

  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specials = "!@#$%^&*()_+[]{}<>?";

  // 1st letter must be uppercase
  let password = upperCase.charAt(Math.floor(Math.random() * upperCase.length));

  // Mandatory characters
  password += lowerCase.charAt(Math.floor(Math.random() * lowerCase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += specials.charAt(Math.floor(Math.random() * specials.length));

  // Remaining characters
  const allChars = lowerCase + numbers + specials;
  for (let i = password.length; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  // Shuffle except first character (uppercase must stay first)
  const firstChar = password[0];
  const rest = password
    .slice(1)
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return firstChar + rest;
};

const generateOtp = (length = 6) => {
  const min = 10 ** (length - 1);
  const max = 10 ** length;
  return crypto.randomInt(min, max);
};


module.exports = {
  generatePassword,
  generateOtp
};