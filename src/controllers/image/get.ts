import { Request, RequestHandler } from 'express';
import logger from '../../logger';
import requestMiddleware from '../../middleware/request-middleware';
import { Image } from '../../models/Image';

const get: RequestHandler = async (req: Request, res) => {

  const query = new Parse.Query(Image);
  const images = await query.find();

  const transformedImages = images.map((image) => {

    const transformedImage: Partial<any> = {
      id: image.uuid,
      imei: image.imei,
      customer_id: image.customer_id,
      snap_time: image.snap_time,
      link: image.link,
      latDecimal: image.latDecimal,
      lonDecimal: image.lonDecimal,
      ts: image.ts,
      created_at: image.created_at,
      _rid: image.rid,
    };

    return transformedImage;
  });

  return res.status(200).send(transformedImages);
};

export default requestMiddleware(get);
