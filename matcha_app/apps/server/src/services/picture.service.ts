import db from '../database/Database';

export const getPicturePath = async (id: number) => {
  const image = await db.image.findFirst({
    where: {
      id,
    },
  });
  if (!image) {
    throw new Error('Image not found');
  }
  return `../private/pictures/${image.url}`;
};
