import { FiUser } from "react-icons/fi";
import { CgDanger } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { MdOutlineColorLens, MdRemoveRedEye } from "react-icons/md";
import { FiTriangle } from "react-icons/fi";

import styles from "./gamePageStyles.module.scss";
import {
  getCyrcleButtons,
  getHiddenButtons,
  findColor,
  calculateColorDifference,
  getTopRowCyrcleIDs,
  getShapeType,
  getHighlighted,
  getCyrcleInitialColors,
} from "../../utils/gameUtil";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAppSelector } from "../../hooks/reduxHooks";
import { Dialog, MiniCard } from "../../components";
import _ from "lodash";

const GamePage: React.FC = () => {
  //// hooks
  const [initialRgbCyrcles, setInitialRgbCyrcles] = useState({
    red: "",
    green: "",
    blue: "",
  });
  const navigate = useNavigate();
  const [dragedElementColor, setDragedElementColor] = useState<string>("");
  const [extraCyrcles, setExtraCyrcles] = useState<any>({});
  const gameData = useAppSelector((state) => state.alchemy.alchemyInfo);
  const [numberOfTrys, setNumberOfTrys] = useState<number>(0);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [indexesOfTheClosests, setIndexesOfTheClosests] = useState<number[]>(
    []
  );
  const [closestColor, setClosestColor] = useState<number[]>([0, 0, 0]);
  const [difference, setDifference] = useState<number>(0);

  const colorsOfElements: number[][] | undefined = [];
  const colorsOfSquares: number[][] | undefined = [];

  useEffect(() => {
    /*
    in this "useEffect" we achive three goals:
    1) we find the indexes of the aquares that have the closets color
    2) we open the "End Dialod" if the game is done
    3)
    */
    const indexes: number[] = [];
    const differences: number[] = [];
    colorsOfElements.forEach((colorOfElement) => {
      differences.push(
        calculateColorDifference(gameData.target, colorOfElement)
      );
    });
    const copyOfDifferences = [...differences].sort();

    differences.forEach((diff, index) => {
      if (diff === copyOfDifferences[0]) {
        indexes.push(index);
      }
    });
    if (!_.isEqual(indexes, indexesOfTheClosests)) {
      /// we need to do this "if" to prevent the re-render-loop
      setIndexesOfTheClosests(indexes);
    }

    if (copyOfDifferences[0] * 100 < 10) {
      /// * 100 so we get the % of the difference
      setShowDialog(true);
    }

    setDifference(copyOfDifferences[0] * 100);
  });

  useEffect(() => {
    setClosestColor(colorsOfElements[indexesOfTheClosests[0] || 0]);
  }, [indexesOfTheClosests]); /// do not to pass that "colorsOfElements" to the dependency array or make a "useCallback" of it

  //// data
  const rows = gameData?.height + 2;
  const columns = gameData?.width + 2;
  const hiddenButtons = getHiddenButtons(rows, columns);
  const cyrcleButtons = getCyrcleButtons(rows, columns);

  //// handlers
  const handleClick = (e: any) => {
    const id = e.target.id;
    if (Object.values(initialRgbCyrcles).includes(id)) {
      return;
    }
    if (cyrcleButtons.includes(id)) {
      if (initialRgbCyrcles.red === "") {
        setInitialRgbCyrcles({ ...initialRgbCyrcles, red: id });
        colorsOfElements.push([255, 0, 0]);
      } else if (initialRgbCyrcles.green === "") {
        setInitialRgbCyrcles({ ...initialRgbCyrcles, green: id });
        colorsOfElements.push([0, 255, 0]);
      } else if (initialRgbCyrcles.blue === "") {
        setInitialRgbCyrcles({ ...initialRgbCyrcles, blue: id });
        colorsOfElements.push([0, 255, 0]);
      }
      setIsFirstLoad(false);
    }
  };

  const handleDragStart = (e: any) => {
    const id = e.target.id;
    if (!cyrcleButtons.includes(id)) {
      setDragedElementColor(
        (e.target as HTMLInputElement).style.backgroundColor
      );
    }
  };

  const handleDrop = (e: any) => {
    const id = (e.target as HTMLInputElement).id;
    if (cyrcleButtons.includes(id)) {
      setExtraCyrcles((preState: any) => ({
        ...preState,
        [id]: dragedElementColor,
      }));
      if (gameData.maxMoves - numberOfTrys === 1) {
        setShowDialog(true);
      }
      setNumberOfTrys((preState) => preState + 1);
      //  setMoved((preState) => preState + 1);
    }
  };

  const handleDialog = () => {
    navigate("/");
  };

  const handleFindColor = (id: string) => {
    const color = findColor(
      id,
      cyrcleButtons,
      hiddenButtons,
      extraCyrcles,
      initialRgbCyrcles,
      rows,
      columns
    );
    if (color) {
      const [r, g, b] = color.match(/\d+/g).map(Number);
      colorsOfElements.push([r, g, b]);
      if (!getCyrcleButtons(rows, columns).includes(id)) {
        colorsOfSquares.push([r, g, b]);
      }
    } else {
      colorsOfElements.push([]);
    }

    return color;
  };

  /// return
  return (
    <div className={styles.container}>
      <Dialog
        title="Good Try! :)"
        text="You couldn't get close enough"
        buttonText="New Game?"
        handleClose={handleDialog}
        isDisplied={showDialog}
      />
      <div className={styles.info}>
        <div className={styles.miniCard}>
          <MiniCard
            title="User ID:"
            text={gameData?.userId}
            icon={<FiUser size={30} />}
            color="#2dd1fa"
          />
        </div>
        <div className={styles.miniCard}>
          <MiniCard
            title="Move left:"
            text={gameData.maxMoves - numberOfTrys}
            icon={<CgDanger size={30} />}
            color="#fa2d2d"
          />
        </div>
        <div className={styles.miniCard}>
          <MiniCard
            title="Target color:"
            text={
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: `rgb(${gameData?.target[0]},${gameData?.target[1]},${gameData?.target[2]})`,
                  borderRadius: "10px",
                }}
              />
            }
            icon={<MdOutlineColorLens size={30} />}
            color="#111111"
          />
        </div>
        <div className={styles.miniCard}>
          <MiniCard
            title="Closets color:"
            text={
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: `rgb(${closestColor?.[0]},${closestColor?.[1]},${closestColor?.[2]})`,
                  borderRadius: "10px",
                }}
              />
            }
            icon={<MdRemoveRedEye size={30} />}
            color="#31f451"
          />
        </div>
        <div>
          <MiniCard
            title="Difference:"
            text={difference.toFixed(0) + "%"}
            icon={<FiTriangle size={30} />}
            color="#e1068a"
          />
        </div>
      </div>

      <div className={styles.shape}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={styles.row}>
            {Array.from({ length: columns }).map((_, j) => (
              <div
                draggable={cyrcleButtons.includes(i + "," + j) ? false : true}
                onDragStart={handleDragStart}
                onDragOver={(ev) => {
                  ev.preventDefault();
                }}
                onDrop={handleDrop}
                style={{
                  color: "white",
                  backgroundColor: handleFindColor(i + "," + j),
                }}
                key={j}
                id={i + "," + j}
                className={`${
                  styles[
                    getShapeType(i + "," + j, hiddenButtons, cyrcleButtons)
                  ]
                } ${
                  styles[getCyrcleInitialColors(i + "," + j, initialRgbCyrcles)]
                } ${
                  styles[
                    getHighlighted(
                      i + "," + j,
                      isFirstLoad,
                      columns,
                      indexesOfTheClosests
                    )
                  ]
                }`}
                onClick={handleClick}
              />
            ))}
            <br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamePage;
