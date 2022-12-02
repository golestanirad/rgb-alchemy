import { useNavigate } from "react-router-dom";
import science from "../../aseets/images/science.svg";
import { PrimaryButton } from "../../components";
import styles from "./landingPageStyles.module.scss";

const LandingPage: React.FC = () => {
  ////hooks
  const navigate = useNavigate();

  //// handlers
  const handleClick = (): void => {
    navigate("/game");
  };
  /// return
  return (
    <div className={styles.container}>
      <img src={science} alt="alchemy" className={styles.image} />
      <PrimaryButton onClick={handleClick}>start</PrimaryButton>
    </div>
  );
};

export default LandingPage;
