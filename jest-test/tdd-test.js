const detail = {
  areaX: 1,
  areaY: 2,
  positionX: 1,
  positionY: 1,
  orientation: 0 // 朝向: N = 0, E = 1, S = 2, W = 3
};

const judegLegal = (position, border) => {
  if (position > border || position < 0) return false;
  return true;
};

/*
 * @params len: front 为正，back为负
 */
const move = len => {
  const orientation = detail.orientation;
  // 判断方向
  if (orientation === 0 || orientation === 2) {
    const afterPositionY = detail.positionY + len;
    if (judegLegal(afterPositionY, detail.areaY)) {
      detail.positionY += len;
    } else {
      detail.afterPositionY = afterPositionY < 0 ? 0 : detail.positionY;
    }
  } else {
    detail.positionX += len;
  }
};

/*
 * @params turn: string[enum] : left | right
 */
const turn = turn => {
  const count = turn === "left" ? -1 : 1;
  // 更新 detail.orientation
  const _orientation = (count + 4) % 4;
  return {
    orientation: _orientation || detail.orientation,
    positionX: detail.positionX,
    positionY: detail.positionY,
    areaX: detail.areaX,
    areaY: detail.areaY
  };
};

/*
 * @params position: obj { x: number, y: number }
 * @params direction: enum { N = 0, E = 1, S = 2, W = 3 }
 */
const init = (position, direction) => {
  return {
    orientation: direction || detail.orientation,
    positionX: position.positionX || detail.positionX,
    positionY: position.positionY || detail.positionY,
    areaX: 1,
    areaY: 2
  };
};

const getArea = () => {
  return {
    x: detail.areaX,
    y: detail.areaY
  };
};

export { getArea, init, turn, move, detail };
