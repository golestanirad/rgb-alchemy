import styles from "./transparentButtonStyles.module.scss";

interface Props {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
}
const TransparentButton: React.FC<Props> = (props) => {
  ///// props
  const { onClick, children, className, type } = props;

  /// return
  return (
    <button
      onClick={onClick}
      className={`${styles.container} ${className}`}
      type={type}
    >
      {children}
    </button>
  );
};

export default TransparentButton;
