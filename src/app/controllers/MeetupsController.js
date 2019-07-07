import * as Yup from 'yup';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import User from '../models/User';
import { isBefore, startOfDay, endOfDay } from 'date-fns';

class MeetupController {
  async index(req, res) {
    const { page = 1, date } = req.query;
    let where = {};

    where.date = {
      [Op.between]: [startOfDay(date), endOfDay(date)],
    };

    const meetups = await Meetup.findAll({
      where,
      include: [
        {
          model: User,
          required: true,
          as: 'user',
        },
      ],
      order: ['date'],
      limit: 10,
      offset: (page - 1) * 10,
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const { date } = req.body;
    const user_id = req.id;

    const schema = Yup.object().shape({
      file_id: Yup.number()
        .required()
        .integer(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid({ ...req.body, user_id }))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    if (isBefore(date, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const meetup = await Meetup.create({
      ...req.body,
      user_id,
    });

    return res.status(201).json(meetup);
  }

  async update(req, res) {
    const { meetupId } = req.params;

    const meetup = await Meetup.findByPk(meetupId);

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup is not found' });
    }

    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({ error: 'Can not change past meetup' });
    }

    if (meetup.user_id !== req.id) {
      return res
        .status(401)
        .json({ error: 'No permission to change this meetup' });
    }

    const meetupUpdated = await meetup.update(req.body);

    return res.json(meetupUpdated);
  }

  async delete(req, res) {
    const { meetupId } = req.params;
    const meetup = await Meetup.findByPk(meetupId);

    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({ error: 'Can not change past meetup' });
    }

    if (meetup.user_id !== req.id) {
      return res
        .status(401)
        .json({ error: 'No permission to change this meetup' });
    }

    await meetup.destroy();

    return res.status(204).json({});
  }
}

export default new MeetupController();
