import type { PartialDeep } from 'type-fest';

import { lambdaClient } from '@/libs/trpc/client';
import { LobeAgentConfig } from '@/types/agent';
import { GlobalRuntimeConfig } from '@/types/serverConfig';

const VERSION_URL = 'https://registry.npmmirror.com/@lobehub/chat/latest';

class GlobalService {
  /**
   * get latest version from npm
   */
  getLatestVersion = async (): Promise<string> => {
    const res = await fetch(VERSION_URL);
    const data = await res.json();

    return data['version'];
  };

  getGlobalConfig = async (): Promise<GlobalRuntimeConfig> => {
    return lambdaClient.config.getGlobalConfig.query();
  };

<<<<<<< HEAD
<<<<<<< HEAD
  getDefaultAgentConfig = async (): Promise<PartialDeep<LobeAgentConfig>> => {
=======
  getDefaultAgentConfig = async (): Promise<DeepPartial<LobeAgentConfig>> => {
>>>>>>> 416a4b121 (✨ feat: Add MCP marketplace and mcp plugin one-click installation in desktop (#8334))
=======
  getDefaultAgentConfig = async (): Promise<PartialDeep<LobeAgentConfig>> => {
>>>>>>> a072b5331 (♻️ refactor: replace `utility-types` with `type-fest` (#8370))
    return lambdaClient.config.getDefaultAgentConfig.query();
  };
}

export const globalService = new GlobalService();
