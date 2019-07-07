import * as Yup from 'yup';
import Meetup from '../models/Meetup';
import { isBefore } from 'date-fns';

class MeetupController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const meetups = await Meetup.findAll({
      where: { user_id: req.id },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
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
      return res.status(400).json({ error: 'Can not change past event' });
    }

    if (meetup.user_id !== req.id) {
      return res
        .status(401)
        .json({ error: 'No permission to change this meetup' });
    }

    const meetupUpdated = await meetup.update(req.body);

    return res.json(meetupUpdated);
  }
}

export default new MeetupController();
