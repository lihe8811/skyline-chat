'use client';

// TODO: update layout to follow project convention

import { ChatHeader } from '@lobehub/ui';
import { LobeHub } from '@lobehub/icons';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { Flexbox } from 'react-layout-kit';

interface ImageLayoutProps {
  children: ReactNode;
  nav: ReactNode;
}

export default function ImageLayout({ children, nav }: ImageLayoutProps) {
  return (
    <Flexbox
      height={'100%'}
      horizontal
      style={{ overflow: 'hidden', position: 'relative' }}
      width={'100%'}
    >
      {nav}
      <Flexbox
        height={'100%'}
        style={{ overflow: 'hidden', position: 'relative' }}
        width={'100%'}
      >
        <ChatHeader
          left={
            <Link href={'/image'} style={{ color: 'inherit' }}>
              <LobeHub.Text size={32} />
            </Link>
          }
          style={{
            position: 'relative',
            zIndex: 10,
          }}
          styles={{
            center: { flex: 1, maxWidth: 1440 },
            left: { flex: 1, maxWidth: 240 },
            right: { flex: 1, maxWidth: 240 },
          }}
        />
        <Flexbox
          height={'100%'}
          horizontal
          style={{ overflow: 'hidden', position: 'relative' }}
          width={'100%'}
        >
          {children}
        </Flexbox>
      </Flexbox>
    </Flexbox>
  );
}