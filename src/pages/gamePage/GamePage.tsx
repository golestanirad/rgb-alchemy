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
  getShapeType,
  getCyrcleInitialColors,
  getHighlighted,
  getClosestRGB,
  getTooltip,
  getPointer,
} from "../../utils/gameUtil";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { Dialog, MiniCard } from "../../components";
import _ from "lodash";
import {
  fetchAlchemyInfo,
  fetchUserAlchemyInfo,
} from "../../store/alchemy/thunks";

const GamePage: React.FC = () => {
  //// hooks
  const dispatch = useAppDispatch();
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
  const [closestSquars, setclosestSquars] = useState<{
    [index: string]: number;
  }>({});
  const [stateSquaresColors, setStatesquaresColors] = useState<{
    [index: string]: number[];
  }>({});

  const [difference, setDifference] = useState<number>(0);
  const squaresColors: { [index: string]: number[] } = {};

  useEffect(() => {
    /*
    in this "useEffect" we achive three goals:
    1) we find the the lowest differnece 
    2) closest squares (squares with lowest difference)
    3) show the dialog if lowest diff is < 10%
    */

    const differences: { [index: string]: number } = {};
    _.forOwn(squaresColors, (color, id) => {
      const diff = calculateColorDifference(gameData.target, color);
      differences[id] = diff;
    });
    let lowestDiff = Object.values(differences).sort()[0];

    let squaresWithLowestDiff: { [index: string]: number } = {};
    _.forOwn(differences, (diff, id) => {
      if (diff === lowestDiff) {
        squaresWithLowestDiff[id] = diff;
      }
    });

    if (!_.isEqual(squaresWithLowestDiff, closestSquars)) {
      /// we need to do this "if" to prevent the re-render-loop
      setclosestSquars(squaresWithLowestDiff);
    }

    if (!_.isEqual(squaresColors, stateSquaresColors)) {
      /// we need to do this "if" to prevent the re-render-loop
      setStatesquaresColors(squaresColors);
    }

    if (lowestDiff * 100 < 10) {
      /// * 100 so we get the % of the difference
      setShowDialog(true);
    }

    setDifference(lowestDiff * 100);
  });

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
      } else if (initialRgbCyrcles.green === "") {
        setInitialRgbCyrcles({ ...initialRgbCyrcles, green: id });
      } else if (initialRgbCyrcles.blue === "") {
        setInitialRgbCyrcles({ ...initialRgbCyrcles, blue: id });
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
    }
  };

  const handleFinishTheGame = () => {
    dispatch(fetchAlchemyInfo());
    navigate("/");
  };

  const handleRestartTheGame = () => {
    setNumberOfTrys(0);
    dispatch(fetchUserAlchemyInfo(gameData.userId));
    setShowDialog(false);
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

    if (color && !getCyrcleButtons(rows, columns).includes(id)) {
      const [r, g, b] = color.match(/\d+/g).map(Number);
      squaresColors[id] = [r, g, b];
    }

    return color;
  };

  /// return
  return (
    <div className={styles.container}>
      <Dialog
        title="Good Try! :)"
        text="You couldn't get close enough"
        handleFinish={handleFinishTheGame}
        handleRestart={handleRestartTheGame}
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
                title={`rgb(${gameData?.target[0]},${gameData?.target[1]},${gameData?.target[2]})`}
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: `rgb(${gameData?.target[0]},${gameData?.target[1]},${gameData?.target[2]})`,
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              />
            }
            icon={<MdOutlineColorLens size={30} />}
            color="#111111"
          />
        </div>
        <div className={styles.miniCard}>
          <MiniCard
            title="Closest color:"
            text={
              <div
                title={`${getClosestRGB(stateSquaresColors, closestSquars)}`}
                style={{
                  width: "30px",
                  height: "30px",
                  cursor: "pointer",
                  backgroundColor: `${getClosestRGB(
                    stateSquaresColors,
                    closestSquars
                  )}`,
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
                title={getTooltip(i + "," + j, stateSquaresColors)}
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
                className={`
                ${styles[getPointer(i + "," + j, stateSquaresColors)]}
                ${
                  styles[
                    getShapeType(i + "," + j, hiddenButtons, cyrcleButtons)
                  ]
                } ${
                  styles[getCyrcleInitialColors(i + "," + j, initialRgbCyrcles)]
                } ${
                  styles[
                    getHighlighted(i + "," + j, isFirstLoad, closestSquars)
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
