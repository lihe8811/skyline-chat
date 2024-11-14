'use client';

import { ActionIcon, Image } from '@lobehub/ui';
import { ImageDown } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';
import { type FC } from 'react';

import { useImageStore } from '@/store/image';
import ImageTaskSelector from '@/components/Image/ImageTaskSelector';

const ImageTaskForm: FC = () => {
  const { displayUrl } = useImageStore();
  
  return (
    <>
      <Flexbox 
        flex={1} 
        padding={12}
        style={{ overflow: 'hidden', position: 'relative' }}
      >
        <ImageTaskSelector />
      </Flexbox>
      <Flexbox 
        flex={1} 
        padding={12}
        style={{ overflow: 'hidden', position: 'relative' }}
      >
        <Image
          alt={''}
          placeholder={<Image preview={false} src='placeholder-square.png' />}
          preview={{
            toolbarAddon: <ActionIcon color={'#fff'} icon={ImageDown} />,
          }}
          size={720}
          src={displayUrl}
        />
      </Flexbox>
    </>
  );
};

ImageTaskForm.displayName = "ImageTaskForm";

export default ImageTaskForm;
