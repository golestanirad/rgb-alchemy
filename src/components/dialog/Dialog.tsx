import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface Props {
  isDisplied: boolean;
  handleClose: () => void;
  title: string;
  text: string;
  buttonText: string;
}

const Dialog: React.FC<Props> = (props) => {
  //// props
  const { isDisplied, handleClose, title, text, buttonText } = props;

  return (
    <Modal show={isDisplied} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{text}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          {buttonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default Dialog;
