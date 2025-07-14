'use client';

<<<<<<< HEAD
<<<<<<< HEAD
import { LoadingOutlined } from '@ant-design/icons';
=======
>>>>>>> 095de5767 (✨ feat:  support AI Image (#8312))
=======
import { LoadingOutlined } from '@ant-design/icons';
>>>>>>> 9557d79e3 (🐛  fix: some ai image bugs (#8432))
import { Block } from '@lobehub/ui';
import { Spin } from 'antd';
import { memo } from 'react';
import { Center } from 'react-layout-kit';

import { AsyncTaskStatus } from '@/types/asyncTask';

import { ActionButtons } from './ActionButtons';
import { ElapsedTime } from './ElapsedTime';
import { useStyles } from './styles';
import { LoadingStateProps } from './types';

// 加载状态组件
export const LoadingState = memo<LoadingStateProps>(({ generation, aspectRatio, onDelete }) => {
  const { styles } = useStyles();

  const isGenerating =
    generation.task.status === AsyncTaskStatus.Processing ||
    generation.task.status === AsyncTaskStatus.Pending;

  return (
    <Block
      align={'center'}
      className={styles.placeholderContainer}
      justify={'center'}
      style={{
        aspectRatio,
        maxWidth: generation.asset?.width ? generation.asset.width / 2 : 'unset',
      }}
      variant={'filled'}
    >
      <Center gap={8}>
<<<<<<< HEAD
<<<<<<< HEAD
        <Spin indicator={<LoadingOutlined spin />} />
=======
        <Spin percent={'auto'} />
>>>>>>> 095de5767 (✨ feat:  support AI Image (#8312))
=======
        <Spin indicator={<LoadingOutlined spin />} />
>>>>>>> 9557d79e3 (🐛  fix: some ai image bugs (#8432))
        <ElapsedTime generationId={generation.id} isActive={isGenerating} />
      </Center>
      <ActionButtons onDelete={onDelete} />
    </Block>
  );
});

LoadingState.displayName = 'LoadingState';
