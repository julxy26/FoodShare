import { NextApiRequest, NextApiResponse } from 'next';
import {
  createImage,
  deleteImagesByPostId,
  updateImages,
} from '../../../../database/images';
import {
  deletePostByPostId,
  getPostByPostId,
  updatePostById,
} from '../../../../database/posts';
import { getValidSessionByToken } from '../../../../database/sessions';
import { updateTag } from '../../../../database/tags';

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
    const post = await getPostByPostId(postId);

    if (!post) {
      return response.status(404).json({ message: 'Not a valid Id' });
    }

    return response.status(200).json(post);
  }

  if (request.method === 'PUT') {
    const title = request.body?.title;
    const price = request.body?.price;
    const description = request.body?.description;
    const street = request.body?.street;
    const district = request.body?.district;
    const tagId = request.body?.tagId;
    const urls = request.body?.urls;

    if (!(title && price && description && street && district)) {
      return response.status(400).json({ message: 'property is missing' });
    }

    const newPost = await updatePostById(
      postId,
      title,
      price,
      description,
      street,
      district,
    );

    const newTag = await updateTag(postId, tagId);

    // const newImages = await updateImages(postId, urls);

    const images = [];

    const deleteImage = await deleteImagesByPostId(postId);

    for (const url of urls) {
      images.push(await createImage(postId, url));
    }

    if (!newPost) {
      return response.status(404).json({ message: 'Not a valid Id' });
    }

    return response.status(200).json({ deleteImage, newPost, newTag, images });
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
