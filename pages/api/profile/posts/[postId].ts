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

  if (!postId) {
    return response.status(404).json({ message: 'Not a valid Id' });
  }

  if (request.method === 'GET') {
    const post = await getSinglePostByPostId(postId);

    if (!post) {
      return response.status(404).json({ message: 'Not a valid Id' });
    }

    return response.status(200).json(post);
  }

  if (request.method === 'PUT') {
    const title = request.body.title;
    const price = request.body.price;
    const description = request.body.description;
    const street = request.body.street;
    const district = request.body.district;
    const tag = request.body.tag;
    const urls = request.body.imageUrls;

    if (!(title && price && description && street && district)) {
      return response.status(400).json({ message: 'property is missing' });
    }

    const newPost = await updateSinglePostById(
      postId,
      title,
      price,
      description,
      street,
      district,
    );

    if (!newPost) {
      return response.status(404).json({ message: 'Not a valid Id' });
    }

    return response.status(200).json(newPost);
  }

  if (request.method === 'DELETE') {
    const deletedPost = await deletePostByPostId(postId);

    if (!deletedPost) {
      return response.status(404).json({ message: 'Not a valid Id' });
    }

    return response.status(200).json(deletedPost);
  }

  return response.status(400).json({ message: 'Method Not Allowed' });
}
