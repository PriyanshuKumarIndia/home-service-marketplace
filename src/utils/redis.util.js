const redis = require('redis');

const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined
});

client.on('error', (err) => {
  console.error('Redis Client Error', err);
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

const connectRedis = async () => {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    throw error;
  }
};

const get = async (key) => {
  return await client.get(key);
};

const set = async (key, value, ttl = 86400) => {
  return await client.setEx(key, ttl, JSON.stringify(value));
};

const del = async (key) => {
  return await client.del(key);
};


module.exports = {
  client,
  get,
  set,
  del,
  connectRedis
};