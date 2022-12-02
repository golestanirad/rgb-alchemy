import { Link } from "react-router-dom";

import styles from "./errorPageStyles.module.scss";
import page_not_found from "../../aseets/images/page_not_found.svg";
import { PrimaryButton } from "../../components";

const ErrorPage = () => {
  /// return
  return (
    <div className={styles.container}>
      <img src={page_not_found} alt="page not found" className={styles.image} />
      <p className={styles.text}>Page was not found!</p>

      <PrimaryButton>
        <Link to="/">Back Home</Link>
      </PrimaryButton>
    </div>
  );
};

export default ErrorPage;
