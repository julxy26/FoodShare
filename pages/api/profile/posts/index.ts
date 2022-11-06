import { NextApiRequest, NextApiResponse } from 'next';
import {
  createPost,
  getPostsByUserId,
  getSinglePostByPostId,
  updateSinglePostById,
} from '../../../../database/posts';
import { getUserBySessionToken } from '../../../../database/users';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'GET') {
    const token = request.cookies.sessionToken;
    const user = token && (await getUserBySessionToken(token));

    if (user) {
      const userId = user.id;
      const posts = [await getPostsByUserId(userId)];

      if (!posts) {
        response.status(400).json({ errors: [{ message: 'no posts found' }] });
        return;
      }
      return response.status(200).json({ posts: posts });
    }
  }

  if (request.method === 'POST') {
    const title = request.body;
    const price = request.body;
    const description = request.body;
    const street = request.body;
    const district = request.body;
    const userId = request.body?.id;
    const imageUrls = request.body;
    // 1. make sure the data exist
    if (
      typeof request.body.title !== 'string' ||
      typeof request.body.price !== 'number' ||
      typeof request.body.description !== 'string' ||
      typeof request.body.district !== 'string' ||
      !request.body.title ||
      !request.body.password ||
      !request.body.description ||
      !request.body.district
    ) {
      return response
        .status(400)
        .json({ errors: [{ message: 'required fields must be filled out' }] });
    }

    // 4. sql query to create the record
    const post = await createPost(
      title,
      price,
      description,
      street,
      district,
      userId,
      imageUrls,
    );
  } else {
    response.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
