const UserService = require('../services/userService');

class UsersController {
  static async getUsers(req, res) {
    try {
      const { page = 1, limit = 6, search = '' } = req.query;
      const data = await UserService.getUsers({
        page: parseInt(page),
        limit: parseInt(limit),
        search
      });
      
      res.json({
        success: true,
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getUser(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = UsersController;