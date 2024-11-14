import { create } from 'zustand';

interface ImageStore {
    displayUrl: string,
    imageUrl: string,
    updateDisplayUrl: (displayUrl: string) => void,
    updateImageUrl: (imageUrl: string) => void,
}

const useImageStore = create<ImageStore>((set) => ({
    displayUrl: '/placeholder-square.png',
    imageUrl: '',
    updateDisplayUrl: (displayUrl: string) => set({ displayUrl: displayUrl }),
    updateImageUrl: (imageUrl: string) => set({ imageUrl: imageUrl }),
}));

export default useImageStore;