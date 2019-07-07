import * as Yup from 'yup';
import Meetup from '../models/Meetup';
import { isBefore } from 'date-fns';

class MeetupController {
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
}

export default new MeetupController();
