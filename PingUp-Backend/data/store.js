const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Role hierarchy: admin > moderator > member
const ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  MEMBER: 'member',
};

const PERMISSIONS = {
  admin:     ['send_message', 'create_room', 'delete_room', 'kick_user', 'promote_user', 'delete_message'],
  moderator: ['send_message', 'create_room', 'kick_user', 'delete_message'],
  member:    ['send_message'],
};

// Seed users (passwords: "admin123", "mod123", "user123")
const users = [
  {
    id: uuidv4(),
    username: 'superadmin',
    password: bcrypt.hashSync('admin123', 10),
    role: ROLES.ADMIN,
    online: false,
    socketId: null,
  },
  {
    id: uuidv4(),
    username: 'moduser',
    password: bcrypt.hashSync('mod123', 10),
    role: ROLES.MODERATOR,
    online: false,
    socketId: null,
  },
  {
    id: uuidv4(),
    username: 'alice',
    password: bcrypt.hashSync('user123', 10),
    role: ROLES.MEMBER,
    online: false,
    socketId: null,
  },
  {
    id: uuidv4(),
    username: 'bob',
    password: bcrypt.hashSync('user123', 10),
    role: ROLES.MEMBER,
    online: false,
    socketId: null,
  },
];

// Seed rooms
const rooms = [
  { id: uuidv4(), name: 'general',     description: 'General discussion',     createdBy: 'superadmin', locked: false },
  { id: uuidv4(), name: 'engineering', description: 'Engineering team room',   createdBy: 'superadmin', locked: false },
  { id: uuidv4(), name: 'ops',         description: 'Operations and DevOps',   createdBy: 'superadmin', locked: false },
];

// messages: { [roomName]: [{ id, userId, username, role, text, timestamp, deleted }] }
const messages = {
  general:     [],
  engineering: [],
  ops:         [],
};

module.exports = { users, rooms, messages, ROLES, PERMISSIONS };
