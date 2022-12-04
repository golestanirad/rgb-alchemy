import _ from "lodash";

export const getHiddenButtons = (
  numberOfRows: number,
  numberOfcolumns: number
) => {
  return [
    "0,0",
    "0," + (numberOfcolumns - 1),
    numberOfRows - 1 + ",0",
    numberOfRows - 1 + "," + (numberOfcolumns - 1),
  ];
};

export const getTopRowCyrcleIDs = (numberOfcolumns: number) => {
  const topRowCyrcleIDs: string[] = [];
  for (let i = 1; i < numberOfcolumns - 1; i++) {
    topRowCyrcleIDs.push(0 + "," + i);
  }
  return topRowCyrcleIDs;
};

export const getBottomRowCyrcleIDs = (
  numberOfRows: number,
  numberOfcolumns: number
) => {
  const bottomRowCyrcleIDs: string[] = [];
  for (let i = 1; i < numberOfcolumns - 1; i++) {
    bottomRowCyrcleIDs.push(numberOfRows - 1 + "," + i);
  }
  return bottomRowCyrcleIDs;
};

export const getLeftColumnCyrcleIDs = (numberOfRows: number) => {
  const leftColumnCyrcleIDs: string[] = [];
  for (let i = 1; i < numberOfRows - 1; i++) {
    leftColumnCyrcleIDs.push(i + "," + 0);
  }
  return leftColumnCyrcleIDs;
};

export const getRightColumnCyrcleIDs = (
  numberOfRows: number,
  numberOfcolumns: number
) => {
  const rightColumnCyrcleIDs: string[] = [];
  for (let i = 1; i < numberOfRows - 1; i++) {
    rightColumnCyrcleIDs.push(i + "," + (numberOfcolumns - 1));
  }
  return rightColumnCyrcleIDs;
};

export const getCyrcleButtons = (
  numberOfRows: number,
  numberOfcolumns: number
) => {
  return [
    ...getTopRowCyrcleIDs(numberOfcolumns),
    ...getBottomRowCyrcleIDs(numberOfRows, numberOfcolumns),
    ...getLeftColumnCyrcleIDs(numberOfRows),
    ...getRightColumnCyrcleIDs(numberOfRows, numberOfcolumns),
  ];
};

export const calculateColorDifference = (target: number[], squre: number[]) => {
  const colorDifference =
    (1 / 255) *
    (1 / Math.sqrt(3)) *
    Math.sqrt(
      Math.pow(target[0] - squre[0], 2) +
        Math.pow(target[1] - squre[1], 2) +
        Math.pow(target[2] - squre[2], 2)
    );
  return colorDifference;
};

const calculateDistance = (
  squareID: string,
  cyrcleID: string,
  rows: number,
  columns: number
): number => {
  let d = 0;
  if (getTopRowCyrcleIDs(columns).includes(cyrcleID)) {
    d = parseInt(squareID.split(",")[0]);
  }
  if (getBottomRowCyrcleIDs(rows, columns).includes(cyrcleID)) {
    d = parseInt(cyrcleID.split(",")[0]) - parseInt(squareID.split(",")[0]);
  }
  if (getLeftColumnCyrcleIDs(rows).includes(cyrcleID)) {
    d = parseInt(squareID.split(",")[1]);
  }
  if (getRightColumnCyrcleIDs(rows, columns).includes(cyrcleID)) {
    d = parseInt(cyrcleID.split(",")[1]) - parseInt(squareID.split(",")[1]);
  }
  return d;
};

export const findColor = (
  id: string,
  cyrcleButtons: string[],
  hiddenButtons: string[],
  extraCyrcles: any,
  initialRgbCyrcles: object,
  rows: number,
  columns: number
) => {
  const isSquare =
    !Object.values(cyrcleButtons).includes(id) &&
    !Object.values(hiddenButtons).includes(id);

  if (isSquare) {
    let distance = 0;
    const squareRowId = id.split(",")[0];
    const squareColumnId = id.split(",")[1];
    let coloredCyrcesIDs = Object.values(initialRgbCyrcles);

    if (!_.isEmpty(extraCyrcles)) {
      coloredCyrcesIDs = [...coloredCyrcesIDs, ...Object.keys(extraCyrcles)];
    }

    const sideCyrclesIDS = [
      //// side cyrcles are the one that are on the left,right, top and bottom of the squre
      0 + "," + squareColumnId,
      rows - 1 + "," + squareColumnId,
      squareRowId + "," + 0,
      squareRowId + "," + (columns - 1),
    ];

    let howMuchRed = 0;
    let howMuchGreen = 0;
    let howMuchBlue = 0;
    let colorOfCyrcle: any = "";

    coloredCyrcesIDs.forEach((cyrcleID) => {
      if (sideCyrclesIDS.includes(cyrcleID)) {
        colorOfCyrcle = _.findKey(
          initialRgbCyrcles,
          (value) => value === cyrcleID
        );

        if (Object.keys(extraCyrcles).includes(cyrcleID)) {
          colorOfCyrcle = extraCyrcles[cyrcleID];
        }

        if (colorOfCyrcle) {
          distance = calculateDistance(id, cyrcleID, rows, columns);

          /// a cyrcle can be on the side (left or right) or at the top pr bottom
          const isTheCyrleOnTheSide = [
            ...getLeftColumnCyrcleIDs(rows),
            ...getRightColumnCyrcleIDs(rows, columns),
          ].includes(cyrcleID);
          /// below we are using that "isTheCyrleOnTheSide" to see if we need to use "h" or "w" at "(w+1−d)/(w+1)or(h+1−d)/(h+1)"
          const length = !isTheCyrleOnTheSide
            ? getLeftColumnCyrcleIDs(rows).length - 1
            : getTopRowCyrcleIDs(columns).length - 1;

          if (colorOfCyrcle === "red") {
            howMuchRed = 255 * ((length + 1 - distance) / (length + 1));
          } else if (colorOfCyrcle === "green") {
            howMuchGreen = 255 * ((length + 1 - distance) / (length + 1));
          } else if (colorOfCyrcle === "blue") {
            howMuchBlue = 255 * ((length + 1 - distance) / (length + 1));
          } else {
            //if none the "if"s above gets trigred and we are in this last else
            //it means that the cyrcle is one of those that we colored by drag/dropping
            const [r, g, b] = colorOfCyrcle.match(/\d+/g).map(Number);
            howMuchRed = r * ((length + 1 - distance) / (length + 1));

            howMuchGreen = g * ((length + 1 - distance) / (length + 1));

            howMuchBlue = b * ((length + 1 - distance) / (length + 1));
          }
        }
      }
    });

    return `rgb(${Math.floor(howMuchRed)}, ${Math.floor(
      howMuchGreen
    )}, ${Math.floor(howMuchBlue)})`;
  } else if (Object.keys(extraCyrcles).includes(id)) {
    return extraCyrcles[id];
  }
};

export const getShapeType = (
  id: string,
  hiddenButtons: string[],
  cyrcleButtons: string[]
) => {
  if (hiddenButtons.includes(id)) {
    return "hidden";
  }
  if (cyrcleButtons.includes(id)) {
    return "cyrcle";
  }
  return "squre";
};

export const getHighlighted = (
  id: string,
  isFirstLoad: boolean,
  squaresWithLowestDiff: { [index: string]: number }
) => {
  if (isFirstLoad) {
    return "";
  }
  // console.log({ keys: Object.keys(squaresWithLowestDiff) });
  return Object.keys(squaresWithLowestDiff).includes(id) ? "highlighted" : "";
};
export const getCyrcleInitialColors = (
  id: string,
  initialRgbCyrcles: object
): string => {
  const isSelected = Object.values(initialRgbCyrcles).includes(id);
  if (isSelected) {
    const keyOfID = Object.keys(initialRgbCyrcles).filter(
      (key) => initialRgbCyrcles[key as keyof typeof initialRgbCyrcles] === id
    )[0];
    return keyOfID;
  }
  return "";
};

export const getClosestRGB = (
  squaresColors: { [index: string]: number[] },
  closestSquars: { [index: string]: number }
) => {
  console.log({ squaresColors, closestSquars });
  if (_.isEmpty(squaresColors)) return "";
  const id = Object.keys(closestSquars)[0];
  const RGB = squaresColors[id];
  return `rgb(${RGB[0]},${RGB[1]},${RGB[2]})`;
};
