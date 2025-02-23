import { removeDuplicate } from '@matcha/common';

// eslint-disable-next-line
const idAlreadyExist = (list: Record<string, any>[], id: number) => {
  return list.some((object) => object.id === id);
};

// eslint-disable-next-line
const generateMainObject = (row: Record<string, any>) => {
  // eslint-disable-next-line
  let formated: Record<string, any> = {};

  for (const [key, value] of Object.entries(row)) {
    const splitKey = key.split('_');
    if (splitKey.length === 1) {
      formated = { ...formated, [key]: value };
    }
  }

  return formated;
};

const generateUnderObject = (
  // eslint-disable-next-line
  row: Record<string, any>,
  underObjectKey: string
) => {
  // eslint-disable-next-line
  const formated: Record<string, any> = {};

  for (const [key, value] of Object.entries(row)) {
    const splitKey = key.split('_');
    if (splitKey[0] === underObjectKey) {
      formated[splitKey[1]] = value;
    }
  }

  return formated;
};

const cleanObject = (
  // eslint-disable-next-line
  object: Record<string, any>,
  shouldGetId: Record<string, boolean>
) => {
  for (const [key, value] of Object.entries(object)) {
    if (Array.isArray(value)) {
      if (value.length === 1) object[key] = value[0];
      else if (Object.values(object[key]).every((value) => value === null))
        object[key] = null;
      else {
        for (const [index, element] of object[key].entries()) {
          if (!shouldGetId[key] && 'id' in element)
            delete object[key][index].id;
        }
      }
    } else {
      if (key === 'id' && !shouldGetId['main']) delete object[key];
    }
  }
};

export const generateObject = (
  // eslint-disable-next-line
  rows: any[],
  shouldGetIdList: Record<string, boolean>
) => {
  // eslint-disable-next-line
  const returnList: Record<string, any>[] = [];

  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;

    const id = row.id;
    if (!idAlreadyExist(returnList, id)) {
      returnList.push({ id });
      delete row.id;
    }
    const listId = returnList.findIndex((object) => object.id === id);

    returnList[listId] = { ...returnList[listId], ...generateMainObject(row) };

    const underObjects = removeDuplicate(
      Object.keys(row)
        .map((key) => {
          const splitKey = key.split('_');
          return splitKey.length === 1 ? '' : splitKey[0];
        })
        .filter((key) => key !== '')
    );

    for (const underObject of underObjects) {
      if (!(underObject in returnList[listId]))
        returnList[listId][underObject] = [];
      const tmpObject = generateUnderObject(row, underObject);
      if (tmpObject.id)
        returnList[listId][underObject].push(
          generateUnderObject(row, underObject)
        );
    }
  }

  for (const object of returnList) {
    cleanObject(object, shouldGetIdList);
  }

  if (returnList.length === 0) return null;
  return returnList.length === 1 ? returnList[0] : returnList;
};
