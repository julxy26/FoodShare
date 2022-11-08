import { NextApiRequest, NextApiResponse } from 'next';
import {
  deletePostByPostId,
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
    const title = request.body.title;
    const price = request.body.price;
    const description = request.body.description;
    const street = request.body.street;
    const district = request.body.district;
    const imageUrls = request.body.imageUrls;

    // Check all the information to create the post exists
    if (!(title && price && description && street && district)) {
      return response.status(400).json({ message: 'property is missing' });
    }

    // TODO: add type checking to the api

    // Create the post using the database util function
    const newPost = await updateSinglePostById(
      title,
      price,
      description,
      street,
      district,
    );

    if (!newPost) {
      return response.status(404).json({ message: 'Not a valid Id' });
    }

    // response with the new created animal
    return response.status(200).json(newPost);
  }

  if (request.method === 'DELETE') {
    const deletedPost = await deletePostByPostId(postId);

    if (!deletedPost) {
      return response.status(404).json({ message: 'Not a valid Id' });
    }

    console.log(deletedPost);

    return response.status(200).json(deletedPost);
  }

  return response.status(400).json({ message: 'Method Not Allowed' });
}
