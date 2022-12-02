import TransparentButton from "../transparentButton/TransparentButton";
import styles from "./primaryButtonStyles.module.scss";

interface Props {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const PrimaryButton: React.FC<Props> = (props) => {
  ////props
  const { className, children, onClick } = props;

  /// return
  return (
    <button className={`${styles.container} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default PrimaryButton;
