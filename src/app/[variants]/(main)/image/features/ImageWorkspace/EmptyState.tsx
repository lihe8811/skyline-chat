<<<<<<< HEAD
<<<<<<< HEAD
=======
import { AuroraBackground } from '@lobehub/ui/awesome';
>>>>>>> 095de5767 (✨ feat:  support AI Image (#8312))
=======
>>>>>>> bc413299b (🐛 fix: some ai image generation feedback issues (#8440))
import { memo } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import PromptInput from '../PromptInput';

const EmptyState = memo(() => {
  return (
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> bc413299b (🐛 fix: some ai image generation feedback issues (#8440))
    <Flexbox
      flex={1}
      height="100%"
      style={{
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      <Center flex={1} padding={24}>
        <PromptInput showTitle={true} />
      </Center>
    </Flexbox>
<<<<<<< HEAD
=======
    <>
      <AuroraBackground
        style={{
          height: 400,
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          position: 'absolute',
          width: '100%',
          zIndex: 0,
        }}
      />
      <Flexbox
        flex={1}
        height="100%"
        style={{
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        <Center flex={1} padding={24}>
          <PromptInput showTitle={true} />
        </Center>
      </Flexbox>
    </>
>>>>>>> 095de5767 (✨ feat:  support AI Image (#8312))
=======
>>>>>>> bc413299b (🐛 fix: some ai image generation feedback issues (#8440))
  );
});

export default EmptyState;
