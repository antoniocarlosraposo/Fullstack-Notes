const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const sqliteConnection = require("../database/sqlite");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const database = await sqliteConnection();
    const checkUserExists = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (checkUserExists) {
      throw new AppError("Email already in use.");
    }

    const hashedPassword = await hash(password, 8);

    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const { id } = request.params;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

    if (!user) {
      throw new AppError("User not found");
    }

    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("This email is already in use");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError(
        "You need to inform old password to set a new password."
      );
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("Old password does not match.");
      }

      user.password = await hash(password, 8);
    }

    await database.run(
      `
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, id]
    );

    return response.json();
  }

  async login(request, response) {
    const { email, password } = request.body;

    if (!email || !password) {
      return response
        .status(400)
        .json({ message: "Username and password are required." });
    }

    const database = await sqliteConnection();

    try {
      const user = await database.get("SELECT * FROM users WHERE email = (?)", [
        email,
      ]);

      if (!user) {
        return response.status(401).json({ message: "Login failed." });
      }

      const isMatch = await compare(password, user.password);
      if (!isMatch) {
        return response.status(401).json({ message: "Login failed." });
      }

      const token = jwt.sign({ userId: user.id }, "SECRET", {
        expiresIn: "1h",
      });

      response.json({ message: "Login successful", token });
    } catch (error) {
      response
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }
}

module.exports = UsersController;
