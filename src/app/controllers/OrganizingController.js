import Meetup from '../models/Meetup';
import { Op } from 'sequelize';

class OrganizingController {
  async index(req, res) {
    const { id: user_id } = req;

    const meetups = await Meetup.findAll({
      where: {
        user_id,
        date: {
          [Op.gte]: new Date(),
        },
      },
      order: ['date'],
    });

    return res.json(meetups);
  }
}

export default new OrganizingController();
