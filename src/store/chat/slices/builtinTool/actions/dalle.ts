import { produce } from 'immer';
import pMap from 'p-map';
import { SWRResponse } from 'swr';
import { StateCreator } from 'zustand/vanilla';

import { useClientDataSWR } from '@/libs/swr';
import { fileService } from '@/services/file';
import { imageGenerationService } from '@/services/textToImage';
import { getFileStoreState } from '@/store/file/store';
import { chatSelectors } from '@/store/chat/selectors';
import { ChatStore } from '@/store/chat/store';
import { DallEImageItem } from '@/types/tool/dalle';
import { setNamespace } from '@/utils/storeDebug';

const n = setNamespace('tool');

const SWR_FETCH_KEY = 'FetchImageItem';

export interface ChatDallEAction {
  generateImageFromPrompts: (items: DallEImageItem[], id: string) => Promise<void>;
  text2image: (id: string, data: DallEImageItem[]) => Promise<void>;
  toggleDallEImageLoading: (key: string, value: boolean) => void;
  updateImageItem: (id: string, updater: (data: DallEImageItem[]) => void) => Promise<void>;
  useFetchDalleImageItem: (id: string) => SWRResponse;
}

export const dalleSlice: StateCreator<
  ChatStore,
  [['zustand/devtools', never]],
  [],
  ChatDallEAction
> = (set, get) => ({
  generateImageFromPrompts: async (items, messageId) => {
    const { toggleDallEImageLoading, updateImageItem } = get();
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const getMessageById = (id: string) => chatSelectors.getMessageById(id)(get());

    const message = getMessageById(messageId);
    if (!message) return;

    let errorArray: any[] = [];

    await pMap(items, async (params, index) => {
      toggleDallEImageLoading(messageId + params.prompt, true);

      let base64 = '';
      try {
        base64 = await imageGenerationService.generateImage(params);
      } catch (e) {
        toggleDallEImageLoading(messageId + params.prompt, false);
        errorArray[index] = e;

        await get().updatePluginState(messageId, { error: errorArray });
      }

      if (!base64) return;

      await updateImageItem(messageId, (draft) => {
        draft[index].base64 = base64;
      });

      toggleDallEImageLoading(messageId + params.prompt, false);

      const data = await getFileStoreState().uploadBase64FileWithProgress(`data:image/png;base64,${base64}`);

      if (!data) return;

      await updateImageItem(messageId, (draft) => {
        draft[index].imageId = data.id;
        draft[index].previewUrl = undefined;
      });
    });
  },

  text2image: async (id, data) => {
    // const isAutoGen = settingsSelectors.isDalleAutoGenerating(useGlobalStore.getState());
    // if (!isAutoGen) return;

    await get().generateImageFromPrompts(data, id);
  },

  toggleDallEImageLoading: (key, value) => {
    set(
      { dalleImageLoading: { ...get().dalleImageLoading, [key]: value } },
      false,
      n('toggleDallEImageLoading'),
    );
  },

  updateImageItem: async (id, updater) => {
    const message = chatSelectors.getMessageById(id)(get());
    if (!message) return;

    const data: DallEImageItem[] = JSON.parse(message.content);

    const nextContent = produce(data, updater);
    await get().internal_updateMessageContent(id, JSON.stringify(nextContent));
  },

  useFetchDalleImageItem: (id) =>
    useClientDataSWR([SWR_FETCH_KEY, id], async () => {
      const item = await fileService.getFile(id);

      set(
        produce((draft) => {
          if (draft.dalleImageMap[id]) return;

          draft.dalleImageMap[id] = item;
        }),
        false,
        n('useFetchFile'),
      );

      return item;
    }),
});
