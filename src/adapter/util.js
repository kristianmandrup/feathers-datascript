export default function toArray(obj) {
  if (obj.length) {
    return obj; // already an array
  }
  const keys = Object.keys(obj);
  var arr = keys.reduce((prev, key) => {
    return prev.concat([key, obj[key]]);
  }, []);
  return arr;
}
