export function toArray(obj) {
  if (obj.length) {
    return obj; // already an array
  }
  const keys = Object.keys(obj);
  var arr = keys.reduce((prev, key) => {
    return prev.concat([key, obj[key]]);
  }, []);
  return arr;
}

export function toTupleList(obj) {
  return Object.keys(obj).map(key => {
    return [key, obj[key]];
  });
}

export function toTupleObjList(obj) {
  return Object.keys(obj).map(key => {
    return {[key]: obj[key]};
  });
}
