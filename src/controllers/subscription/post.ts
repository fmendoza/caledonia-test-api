import { Request, RequestHandler } from 'express';
import { Subscription } from '../../models/Subscription';
import logger from '../../logger';
import requestMiddleware from '../../middleware/request-middleware';

const post: RequestHandler = async (req: Request, res) => {
  const { userId } = req.params;
  let cameras = req.body;
  logger.silly(`Subscription to update for customer: ${userId}`);

  const query = new Parse.Query(Subscription);
  query.equalTo('customerId', userId);
  const subscription = await query.first();
  if (!subscription) {
    return res.status(404).send({
      error: 'Subscription not found'
    });
  }

  cameras = Array.isArray(cameras) ? cameras : [];

  subscription.cameras = [
    ...subscription.cameras,
    ...cameras
  ];

  if (subscription.cameras.length > subscription.cameraSlots) {
    return res.status(409).send({
      error: 'The user does not have enough slots to add the desired cameras.'
    });
  }

  await subscription.save();

  return res.status(200).send(subscription.toJSON());
};

export default requestMiddleware(post);
