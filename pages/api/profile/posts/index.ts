import { NextApiRequest, NextApiResponse } from 'next';
import { createPost, getPostsByUserId } from '../../../../database/posts';
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
      const posts = await getPostsByUserId(userId);

      if (!posts) {
        response.status(400).json({ errors: [{ message: 'no posts found' }] });
        return;
      }
      return response.status(200).json({ posts: posts });
    }
  }

  if (request.method === 'POST') {
    const token = request.cookies.sessionToken;
    const user = token && (await getUserBySessionToken(token));

    if (user) {
      const id = user.id;
      const title = request.body.title;
      const price = request.body.price;
      const description = request.body.description;
      const street = request.body.street;
      const district = request.body.district;
      const userId = id;
      const imageUrls = request.body.imageUrls;

      // 1. make sure the data exist
      if (
        typeof title !== 'string' ||
        typeof price !== 'number' ||
        typeof description !== 'string' ||
        typeof street !== 'string' ||
        typeof district !== 'number' ||
        !title ||
        !price ||
        !description ||
        !street ||
        !district
      ) {
        return response.status(400).json({
          errors: [{ message: 'required fields must be filled out' }],
        });
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

      return response.status(200).json({ post: post });
    }
  } else {
    response.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
