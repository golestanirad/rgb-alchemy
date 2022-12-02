import { LightenDarkenColor } from "../../../utils/cssUtils";
import styles from "./miniCardStyles.module.scss";

interface Props {
  title: string;
  text: any;
  icon: React.ReactNode;
  color?: string;
}

const MiniCard: React.FC<Props> = (props) => {
  /// props
  const { icon, title, text, color = "#000000" } = props;
  /// return
  return (
    <div className={styles.container}>
      <div
        className={styles.icon}
        style={{
          color: color,
          backgroundColor: LightenDarkenColor(color, 150),
        }}
      >
        {icon}
      </div>

      <div className={styles.title}>{title}</div>
      <div>{text}</div>
    </div>
  );
};

export default MiniCard;
