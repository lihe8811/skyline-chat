import { Modal } from '@lobehub/ui';
import { Button } from 'antd';
import { HighlightOutlined } from '@ant-design/icons';
import { useState, useRef } from "react";
import { useImageStore } from '@/store/image';

import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

const ButtonWithCanvas = () => {
  const { updateImageUrl } = useImageStore();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const canvasRef = useRef<ReactSketchCanvasRef | null>(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const cancelModal = () => {
    setIsModalOpen(false);
  };

  const clearCanvas = () => {
    canvasRef.current?.clearCanvas();
  }

  const submitCanvas = async () => {
    canvasRef.current?.exportImage('png')
      .then((imageData) => {
        return fetch('/api/sketch', {
          body: JSON.stringify({ imageData }),
          headers: {'Content-Type': 'application/json'},
          method: 'POST',
        });
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network error.');
        }
      })
      .then(({ imageUrl }) => {
        updateImageUrl(imageUrl);
      })
      .catch((error) => {
        console.error('Error exporting image:', error);
      });

    setIsModalOpen(false);
  }

  const canvasStyle = {
    border: "0.0625rem solid rgba(156, 156, 156, 0.5)"
  };

  return (
    <>
      <Button 
        icon={<HighlightOutlined />}
        onClick={showModal}
        type={'primary'}
      >
        Create
      </Button>
      <Modal
        className={'canvas-modal'}
        footer={<>
          <Button onClick={clearCanvas}>Clear</Button>
          <Button onClick={submitCanvas} type={'primary'}>Save</Button>
        </>}
        onCancel={cancelModal}
        open={isModalOpen}
        title={'Create Sketch'}
      >
        <ReactSketchCanvas
          className={'sketch-canvas'}
          height={'512px'} 
          ref={canvasRef}
          strokeColor={'#000'} 
          strokeWidth={6} 
          style={canvasStyle}
          width={'512px'} 
        />
      </Modal>
    </>
  );
}

export default ButtonWithCanvas;