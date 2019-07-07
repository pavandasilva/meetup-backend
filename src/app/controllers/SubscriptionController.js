import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import { isBefore } from 'date-fns';

class SubscriptionController {
  async store(req, res) {
    const { meetup_id } = req.body;
    const { id: user_id } = req;

    const meetup = await Meetup.findByPk(meetup_id);

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup is not found' });
    }

    if (meetup.user_id === user_id) {
      return res.status(400).json({ error: 'Can not sign up to meetup' });
    }

    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({ error: 'Can not sign up for past meetup' });
    }

    const isSignUp = await Subscription.findOne({
      where: { meetup_id },
    });

    if (isSignUp) {
      return res
        .status(400)
        .json({ error: 'You already have register to meetup' });
    }

    const isCommitted = await Subscription.findOne({
      where: {
        user_id,
      },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (isCommitted) {
      return res.status(400).json({ error: 'Can not subscribe to meetup' });
    }

    await Subscription.create({
      user_id,
      meetup_id,
    });

    return res.status(204).json();
  }
}

export default new SubscriptionController();
