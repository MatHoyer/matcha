export const generateObject = (rows: any[]) => {
  const object: Record<string, any> = {};

  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    for (const [key, value] of Object.entries(row as Record<string, any>)) {
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
    if (object[key] && typeof object[key] === 'object') {
      const isFullNull = Object.values(object[key]).every((value) => value === null);
      if (isFullNull) {
        object[key] = null;
      }
    }
  }

  return object;
};
