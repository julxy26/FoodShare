import { NextApiRequest, NextApiResponse } from 'next';
import {
  getSinglePostByPostId,
  updateSinglePostById,
} from '../../../../database/posts';
import { getValidSessionByToken } from '../../../../database/sessions';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const session =
    request.cookies.sessionToken &&
    (await getValidSessionByToken(request.cookies.sessionToken));

  if (!session) {
    response
      .status(400)
      .json({ errors: [{ message: 'No valid session token passed' }] });
    return;
  }

  const postId = Number(request.query.postId);

  // check if the id is a number
  if (!postId) {
    return response.status(404).json({ message: 'Not a valid Id' });
  }

  if (request.method === 'GET') {
    const post = await getSinglePostByPostId(postId);

    // check if post exists on the database
    if (!post) {
      return response.status(404).json({ message: 'Not a valid Id' });
    }

    return response.status(200).json(post);
  }

  // prevent the endpoint to be accessed by cross site requests

  if (request.method === 'PUT') {
    // NOT getting the id from the body since is already on the query
    const title = request.body.title;
    const price = request.body.price;
    const description = request.body.description;
    const street = request.body.street;
    const district = request.body.district;
    const imageUrl = request.body.imageUrl;

    // Check all the information to create the post exists
    if (!(title && price && description)) {
      return response
        .status(400)
        .json({ message: 'property firstName, accessory or type missing' });
    }

    // TODO: add type checking to the api

    // Create the post using the database util function
    const newAnimal = await updateSinglePostById(
      title,
      price,
      description,
      street,
      district,
      imageUrl,
    );

    if (!newAnimal) {
      return response.status(404).json({ message: 'Not a valid Id' });
    }

    // response with the new created animal
    return response.status(200).json(newAnimal);
  }

  // if (request.method === 'DELETE') {
  //   const deletedAnimal = await deleteAnimalById(postId);

  //   if (!deletedAnimal) {
  //     return response.status(404).json({ message: 'Not a valid Id' });
  //   }

  //   console.log(deletedAnimal);

  //   return response.status(200).json(deletedAnimal);
  // }

  return response.status(400).json({ message: 'Method Not Allowed' });
}
