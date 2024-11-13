'use client';

const getDomainName = () => {
  if (typeof window !== 'undefined') {
    return window.location.hostname;
  }
  return '';
};

export default getDomainName;