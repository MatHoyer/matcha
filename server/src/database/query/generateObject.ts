export const generateObject = (rows: any[], shouldGetId: Record<string, boolean>) => {
  const object: Record<string, any> = {};

  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    for (const [key, value] of Object.entries(row as Record<string, any>)) {
      console.log(object);
      const splitKey = key.split('_');
      const underObject = splitKey[0];

      if (splitKey.length === 1) {
        object[underObject] = value;
      } else if (underObject in object) {
        let found = false;
        for (const objectValue of object[underObject]) {
          if (!(splitKey[1] in objectValue)) {
            objectValue[splitKey[1]] = value;
            found = true;
          } else if (objectValue[splitKey[1]] === value) {
            found = true;
          }
        }
        if (!found) {
          object[underObject].push({ [splitKey[1]]: value });
        }
      } else {
        object[underObject] = [{ [splitKey[1]]: value }];
      }
    }
  }

  for (const key in object) {
    if (Array.isArray(object[key]) && object[key].length === 1) {
      object[key] = object[key][0];
    }
    const isFullNull = Object.values(object[key]).every((value) => value === null);
    if (isFullNull) {
      object[key] = null;
    }
    if (object[key] && typeof object[key] === 'object') {
      for (const [index, element] of object[key].entries()) {
        if (!shouldGetId[key] && 'id' in element) {
          delete object[key][index].id;
        }
      }
    }
  }

  return object;
};
