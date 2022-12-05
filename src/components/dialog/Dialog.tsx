import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface Props {
  isDisplied: boolean;
  handleFinish: () => void;
  handleRestart: () => void;
  title: string;
  text: string;
}

const Dialog: React.FC<Props> = (props) => {
  //// props
  const { isDisplied, handleFinish, handleRestart, title, text } = props;

  return (
    <Modal show={isDisplied}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{text}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleFinish}>
          Finish The Game
        </Button>
        <Button variant="primary" onClick={handleRestart}>
          Play Again
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default Dialog;
