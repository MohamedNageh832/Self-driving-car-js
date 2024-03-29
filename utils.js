function lerp(a, b, t) {
  return a + (b - a) * t;
}

function getIntersection(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (A.x - B.x) * (C.y - A.y) - (A.y - B.y) * (C.x - A.x);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom === 0) return null;

  const t = tTop / bottom;
  const u = uTop / bottom;

  if (t < 0 || t > 1 || u < 0 || u > 1) return null;

  return {
    x: lerp(A.x, B.x, t),
    y: lerp(A.y, B.y, t),
    offset: t,
  };
}

function polyIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = getIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length]
      );

      if (touch) return true;
    }
  }

  return false;
}

function deepClone(object) {
  if (typeof object !== "object" || object === null) return object;

  const result = Array.isArray(object) ? [] : {};
  const keys = Object.keys(object);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    result[key] = deepClone(object[key]);
  }

  return result;
}
