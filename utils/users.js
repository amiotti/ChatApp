let users = [];

//User Joins Chat
const userJoin = (id, username, room) => {
  const user = { id, username, room };

  users.push(user);

  return user;
};

//Get Current User
const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

//All users
const allUsers = (room) => {
  return users.filter((user) => user.room === room);
};

//User disconnection
const userDisconnect = (id, username, room) => {
  users = users.filter((el) => el.username !== username);
  return users;
};

// on Close connection
const onDisconnect = () => {
  users = [];
  return users;
};

module.exports = {
  userJoin,
  getCurrentUser,
  allUsers,
  userDisconnect,
  onDisconnect,
};
