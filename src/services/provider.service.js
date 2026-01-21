
const { registerUser, login, getVerifiedUsers } = require("./user.service");

const registerProvider = async (payload) => {
  try {
   const provider = await registerUser(payload, "Service provider");
   return provider;
  } catch (error) {
    console.error("Provider registeration failed: ", error);
    throw error;
  }
};

const getVerifiedProviders = async () => {
 try {
    return await getVerifiedUsers("Service provider");
 } catch (error) {
    console.error("Provider listing failed: ", error);
    throw error;
 }
};

const providerLogin = async (payload) => {
  try {
   return await login(payload, "Service provider");
  } catch (error) {
    console.error("Login Service Error:", error);
    throw error;
  }
};


module.exports = {
  registerProvider,
  getVerifiedProviders,
  providerLogin,
};
