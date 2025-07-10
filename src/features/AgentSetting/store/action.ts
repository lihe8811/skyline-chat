import type { PartialDeep } from 'type-fest';
import { getSingletonAnalyticsOptional } from '@lobehub/analytics';
import { StateCreator } from 'zustand/vanilla';

import { chainPickEmoji } from '@/chains/pickEmoji';
import { chainSummaryAgentName } from '@/chains/summaryAgentName';
import { chainSummaryDescription } from '@/chains/summaryDescription';
import { chainSummaryTags } from '@/chains/summaryTags';
import { TraceNameMap, TracePayload, TraceTopicType } from '@/const/trace';
import { chatService } from '@/services/chat';
import { useUserStore } from '@/store/user';
import { systemAgentSelectors } from '@/store/user/slices/settings/selectors';
import { LobeAgentChatConfig, LobeAgentConfig } from '@/types/agent';
import { MetaData } from '@/types/meta';
import { SystemAgentItem } from '@/types/user/settings';
import { MessageTextChunk } from '@/utils/fetch';
import { merge } from '@/utils/merge';
import { setNamespace } from '@/utils/storeDebug';

import { LoadingState } from '../store/initialState';
import { State, initialState } from './initialState';
import { ConfigDispatch, configReducer } from './reducers/config';
import { MetaDataDispatch, metaDataReducer } from './reducers/meta';

export interface PublicAction {
  /**
   * 自动选择表情
   * @param id - 表情的 ID
   */
  autoPickEmoji: () => Promise<void>;
  /**
   * 自动完成代理描述
   * @param id - 代理的 ID
   * @returns 一个 Promise，用于异步操作完成后的处理
   */
  autoCompleteAgentDescription: (id: string) => Promise<void>;
  /**
   * 自动完成代理信息
   * @param id - 代理的 ID
   * @returns 一个 Promise，用于异步操作完成后的处理
   */
  autoCompleteAgentMeta: (id: string) => Promise<void>;
  /**
   * 自动完成代理名称
   * @param id - 代理的 ID
   * @returns 一个 Promise，用于异步操作完成后的处理
   */
  autoCompleteAgentTitle: (id: string) => Promise<void>;
  /**
   * 自动完成代理标签
   * @param id - 代理的 ID
   * @returns 一个 Promise，用于异步操作完成后的处理
   */
  autoCompleteAgentTags: (id: string) => Promise<void>;
  /**
   * 重置代理
   */
  resetAgent: () => void;
  /**
   * 更新代理配置
   * @param agent - LobeAgentConfig 的部分对象
   */
  updateAgentConfig: (agent: PartialDeep<LobeAgentConfig>) => void;
  /**
   * 更新代理元数据
   * @param meta - MetaData 的部分对象
   */
  updateAgentMeta: (meta: PartialDeep<MetaData>) => void;
  /**
   * 更新代理会话配置
   * @param config - LobeAgentChatConfig 的部分对象
   */
  updateChatConfig: (config: PartialDeep<LobeAgentChatConfig>) => void;
}

export interface Action extends PublicAction {
  dispatchConfig: (payload: ConfigDispatch) => Promise<void>;
  dispatchMeta: (payload: MetaDataDispatch) => Promise<void>;
  getCurrentTracePayload: (data: Partial<TracePayload>) => TracePayload;

  internal_getSystemAgentForMeta: () => SystemAgentItem;
  resetAgentConfig: () => Promise<void>;

  resetAgentMeta: () => Promise<void>;
  setAgentConfig: (config: PartialDeep<LobeAgentConfig>) => Promise<void>;
  setAgentMeta: (meta: PartialDeep<MetaData>) => Promise<void>;

  setChatConfig: (config: PartialDeep<LobeAgentChatConfig>) => Promise<void>;
  streamUpdateMetaArray: (key: keyof MetaData) => any;
  streamUpdateMetaString: (key: keyof MetaData) => any;
  toggleAgentPlugin: (pluginId: string, state?: boolean) => void;

  /**
   * 更新加载状态
   * @param key - SessionLoadingState 的键
   * @param value - 加载状态的值
   */
  updateLoadingState: (key: keyof LoadingState, value: boolean) => void;
}

export type Store = Action & State;

const t = setNamespace('AgentSettings');

export const store: StateCreator<Store, [['zustand/devtools', never]]> = (set, get) => ({
  ...initialState,
  autoPickEmoji: async () => {
    const { config, meta, dispatchMeta } = get();

    const systemRole = config.systemRole;

    chatService.fetchPresetTaskResult({
      onFinish: async (emoji) => {
        dispatchMeta({ type: 'update', value: { avatar: emoji } });
      },
      onLoadingChange: (loading) => {
        get().updateLoadingState('avatar', loading);
      },
      params: merge(
        get().internal_getSystemAgentForMeta(),
        chainPickEmoji([meta.title, meta.description, systemRole].filter(Boolean).join(',')),
      ),
      trace: get().getCurrentTracePayload({ traceName: TraceNameMap.EmojiPicker }),
    });
  },
  autoCompleteAgentDescription: async (id: string) => {
    const { dispatchMeta, config, meta, updateLoadingState, streamUpdateMetaString } = get();

    const systemRole = config.systemRole;

    if (!systemRole) return;

    const preValue = meta.description;

    // 替换为 ...
    dispatchMeta({ type: 'update', value: { description: '...' } });

    chatService.fetchPresetTaskResult({
      onError: () => {
        dispatchMeta({ type: 'update', value: { description: preValue } });
      },
      onLoadingChange: (loading) => {
        updateLoadingState('description', loading);
      },
      onMessageHandle: streamUpdateMetaString('description'),
      params: merge(get().internal_getSystemAgentForMeta(), chainSummaryDescription(systemRole)),
      trace: get().getCurrentTracePayload({ traceName: TraceNameMap.SummaryAgentDescription }),
    });
  },
  autoCompleteAgentMeta: async (id: string) => {
    const { dispatchMeta, config, meta, updateLoadingState, streamUpdateMetaString } = get();

    const systemRole = config.systemRole;

    if (!systemRole) return;

    const preValue = meta.description;

    // 替换为 ...
    dispatchMeta({ type: 'update', value: { description: '...' } });

    chatService.fetchPresetTaskResult({
      onError: () => {
        dispatchMeta({ type: 'update', value: { description: preValue } });
      },
      onLoadingChange: (loading) => {
        updateLoadingState('description', loading);
      },
      onMessageHandle: streamUpdateMetaString('description'),
      params: merge(get().internal_getSystemAgentForMeta(), chainSummaryDescription(systemRole)),
      trace: get().getCurrentTracePayload({ traceName: TraceNameMap.SummaryAgentDescription }),
    });
  },
  autoCompleteAgentTitle: async (id: string) => {
    const { dispatchMeta, config, meta, updateLoadingState, streamUpdateMetaString } = get();

    const systemRole = config.systemRole;

    if (!systemRole) return;

    const previousTitle = meta.title;

    // 替换为 ...
    dispatchMeta({ type: 'update', value: { title: '...' } });

    chatService.fetchPresetTaskResult({
      onError: () => {
        dispatchMeta({ type: 'update', value: { title: previousTitle } });
      },
      onLoadingChange: (loading) => {
        updateLoadingState('title', loading);
      },
      onMessageHandle: streamUpdateMetaString('title'),
      params: merge(
        get().internal_getSystemAgentForMeta(),
        chainSummaryAgentName([meta.description, systemRole].filter(Boolean).join(',')),
      ),
      trace: get().getCurrentTracePayload({ traceName: TraceNameMap.SummaryAgentTitle }),
    });
  },
  autoCompleteAgentTags: async (id: string) => {
    const { dispatchMeta, config, meta, updateLoadingState, streamUpdateMetaArray } = get();

    const systemRole = config.systemRole;

    if (!systemRole) return;

    const preValue = meta.tags;

    // 替换为 ...
    dispatchMeta({ type: 'update', value: { tags: ['...'] } });

    // Get current agent for agentMeta
    chatService.fetchPresetTaskResult({
      onError: () => {
        dispatchMeta({ type: 'update', value: { tags: preValue } });
      },
      onLoadingChange: (loading) => {
        updateLoadingState('tags', loading);
      },
      onMessageHandle: streamUpdateMetaArray('tags'),
      params: merge(
        get().internal_getSystemAgentForMeta(),
        chainSummaryTags([meta.title, meta.description, systemRole].filter(Boolean).join(',')),
      ),
      trace: get().getCurrentTracePayload({ traceName: TraceNameMap.SummaryAgentTags }),
    });
  },
  resetAgent: () => {
    get().resetAgentConfig();
    get().resetAgentMeta();
  },
  updateAgentConfig: async (config: PartialDeep<LobeAgentConfig>) => {
    await get().dispatchConfig({ config, type: 'update' });
  },
  updateAgentMeta: async (meta: PartialDeep<MetaData>) => {
    const { dispatchMeta, id, meta: currentMeta } = get();
    const mergedMeta = merge(currentMeta, meta);

    try {
      const analytics = getSingletonAnalyticsOptional();
      if (analytics) {
        analytics.track({
          name: 'agent_meta_updated',
          properties: {
            assistant_avatar: mergedMeta.avatar,
            assistant_background_color: mergedMeta.backgroundColor,
            assistant_description: mergedMeta.description,
            assistant_name: mergedMeta.title,
            assistant_tags: mergedMeta.tags,
            is_inbox: id === 'inbox',
            session_id: id || 'unknown',
            timestamp: Date.now(),
            user_id: useUserStore.getState().user?.id || 'anonymous',
          },
        });
      }
    } catch (error) {
      console.warn('Failed to track agent meta update:', error);
    }
    await dispatchMeta({ type: 'update', value: meta });
  },
  updateChatConfig: async (config: PartialDeep<LobeAgentChatConfig>) => {
    await get().setAgentConfig({ chatConfig: config });
  },
  dispatchConfig: async (payload: ConfigDispatch) => {
    const nextConfig = configReducer(get().config, payload);

    set({ config: nextConfig }, false, payload);

    await get().onConfigChange?.(nextConfig);
  },
  dispatchMeta: async (payload: MetaDataDispatch) => {
    const nextValue = metaDataReducer(get().meta, payload);

    set({ meta: nextValue }, false, payload);

    await get().onMetaChange?.(nextValue);
  },
  getCurrentTracePayload: (data: Partial<TracePayload>) => ({
    sessionId: get().id,
    topicId: TraceTopicType.AgentSettings,
    ...data,
  }),

  internal_getSystemAgentForMeta: () => {
    return systemAgentSelectors.agentMeta(useUserStore.getState());
  },

  resetAgentConfig: async () => {
    await get().dispatchConfig({ type: 'reset' });
  },

  resetAgentMeta: async () => {
    await get().dispatchMeta({ type: 'reset' });
  },
  setAgentConfig: async (config: PartialDeep<LobeAgentConfig>) => {
    await get().dispatchConfig({ config, type: 'update' });
  },
  setAgentMeta: async (meta: PartialDeep<MetaData>) => {
    const { dispatchMeta, id, meta: currentMeta } = get();
    const mergedMeta = merge(currentMeta, meta);

    try {
      const analytics = getSingletonAnalyticsOptional();
      if (analytics) {
        analytics.track({
          name: 'agent_meta_updated',
          properties: {
            assistant_avatar: mergedMeta.avatar,
            assistant_background_color: mergedMeta.backgroundColor,
            assistant_description: mergedMeta.description,
            assistant_name: mergedMeta.title,
            assistant_tags: mergedMeta.tags,
            is_inbox: id === 'inbox',
            session_id: id || 'unknown',
            timestamp: Date.now(),
            user_id: useUserStore.getState().user?.id || 'anonymous',
          },
        });
      }
    } catch (error) {
      console.warn('Failed to track agent meta update:', error);
    }
    await dispatchMeta({ type: 'update', value: meta });
  },

  setChatConfig: async (config: PartialDeep<LobeAgentChatConfig>) => {
    await get().setAgentConfig({ chatConfig: config });
  },

  streamUpdateMetaArray: (key: keyof MetaData) => {
    let value = '';
    return (chunk: MessageTextChunk) => {
      switch (chunk.type) {
        case 'text': {
          value += chunk.text;
          get().dispatchMeta({ type: 'update', value: { [key]: value.split(',') } });
        }
      }
    };
  },

  streamUpdateMetaString: (key: keyof MetaData) => {
    let value = '';
    return (chunk: MessageTextChunk) => {
      switch (chunk.type) {
        case 'text': {
          value += chunk.text;
          get().dispatchMeta({ type: 'update', value: { [key]: value } });
        }
      }
    };
  },

  toggleAgentPlugin: (id: string, state?: boolean) => {
    get().dispatchConfig({ pluginId: id, state, type: 'togglePlugin' });
  },

  updateLoadingState: (key: keyof LoadingState, value: boolean) => {
    set(
      { loadingState: { ...get().loadingState, [key]: value } },
      false,
      t('updateLoadingState', { key, value }),
    );
  },
});
