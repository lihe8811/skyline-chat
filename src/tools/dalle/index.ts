import { BuiltinToolManifest } from '@/types/tool';

// import {SiOpenai} from "@icons-pack/react-simple-icons";

export const DalleManifest: BuiltinToolManifest = {
  api: [
    {
      description: 'Create images from a text-only prompt.',
      name: 'text2image',
      parameters: {
        properties: {
          prompts: {
            description:
              "The user's original image description, potentially modified to abide by the lobe-image-designer policies. If the user does not suggest a number of captions to create, create four of them. If creating multiple captions, make them as diverse as possible. If the user requested modifications to previous images, the captions should not simply be longer, but rather it should be refactored to integrate the suggestions into each of the captions. Generate no more than 4 images, even if the user requests more.",
            items: {
              type: 'string',
            },
            maxItems: 1,
            minItems: 1,
            type: 'array',
          },
          quality: {
            default: 'medium',
            description:
              'The quality of the image that will be generated.',
            enum: ['high', 'medium', 'low'],
            type: 'string',
          },
          size: {
            default: '1024x1024',
            description:
              'The resolution of the requested image, which can be wide, square, or tall. Use 1024x1024 (square) as the default unless the prompt suggests a wide image, 1536x1024, or a full-body portrait, in which case 1024x1536 (tall) should be used instead. Always include this parameter in the request.',
            enum: ['1536x1024', '1024x1024', '1024x1536'],
            type: 'string',
          },
        },
        required: ['prompts'],
        type: 'object',
      },
    },
  ],
  // due to system prompt is for training Dalle3 as a built-in tool by OpenAI,
  // there are occasional instances where the function call contains the name "dalle," leading to subsequent failures.
  // so we need a different unique identifier to avoid failure.refs:
  // https://github.com/lobehub/lobe-chat/issues/783
  // https://github.com/lobehub/lobe-chat/issues/870
  identifier: 'lobe-image-designer',
  meta: {
    avatar: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiIgZmlsbD0ibm9uZSIgc3R5bGU9ImNvbG9yOiNmZmY7ZmlsbDojMDAwIj4KICAgIDxwYXRoIGQ9Ik0wIDBoOTZ2OTZIMHoiLz4KICAgIDxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIKICAgICAgICAgIGQ9Ik03OC44MyA0MS40NjJBMTcuOTQgMTcuOTQgMCAwIDAgNzcuMjkgMjYuNzNhMTguMTQgMTguMTQgMCAwIDAtMTkuNTM4LTguNzA0IDE3LjkzNyAxNy45MzcgMCAwIDAtMTMuNTI5LTYuMDMxIDE4LjE0MyAxOC4xNDMgMCAwIDAtMTcuMzA1IDEyLjU2IDE3Ljk0NiAxNy45NDYgMCAwIDAtMTEuOTk0IDguNzAxIDE4LjE0MyAxOC4xNDMgMCAwIDAgMi4yMzMgMjEuMjcxIDE3LjkzOCAxNy45MzggMCAwIDAgMS41NCAxNC43MzIgMTguMTQxIDE4LjE0MSAwIDAgMCAxOS41MzggOC43MDQgMTcuOTMgMTcuOTMgMCAwIDAgMTMuNTI4IDYuMDMxQTE4LjE0MiAxOC4xNDIgMCAwIDAgNjkuMDggNzEuNDI3YTE3LjkzOCAxNy45MzggMCAwIDAgMTEuOTk0LTguNzAxIDE4LjE0MSAxOC4xNDEgMCAwIDAtMi4yNDMtMjEuMjY0Wk01MS45MSA3OS4yODdjLTMuNTgzIDAtNi4zNTYtMS4xLTguNzgtMy4xMjIuMTEtLjA2LjMwMi0uMTY1LjQyNy0uMjQybDE0LjMzNi04LjI4YTIuMzI3IDIuMzI3IDAgMCAwIDEuMTc4LTIuMDRWNDUuMzkybDYuMDYgMy40OTlhLjIxNy4yMTcgMCAwIDEgLjExOC4xNjZWNjUuNzljLS4wMDEgNy41OTMtNi4zMjIgMTMuNDk3LTEzLjM0IDEzLjQ5N1pNMjIuNzc4IDY2LjkwNmExMy40NDcgMTMuNDQ3IDAgMCAxLTEuNjEtOS4wNDJjLjEwNy4wNjQuMjkzLjE3OC40MjYuMjU0TDM1LjkzIDY2LjRhMi4zMyAyLjMzIDAgMCAwIDIuMzU1IDBsMTcuNTAzLTEwLjEwNnY2Ljk5OGEuMjE3LjIxNyAwIDAgMS0uMDg3LjE4Nkw0MS4yMSA3MS44NDRhMTMuNTA3IDEzLjUwNyAwIDAgMS0xOC40MzEtNC45MzhabS0zLjc3Ny0zMS4yOTdhMTMuNDQ5IDEzLjQ0OSAwIDAgMSA3LjAyMy01LjkxNlY0Ni43NWEyLjMyNCAyLjMyNCAwIDAgMCAxLjE3NyAyLjAzOGwxNy41MDEgMTAuMTA1LTYuMDYgMy40OTlhLjIxOC4yMTggMCAwIDEtLjIwNC4wMThsLTE0LjQ5My04LjM3NEExMy41MDcgMTMuNTA3IDAgMCAxIDE5IDM1LjYwOVptNDkuNzkgMTEuNTg3TDUxLjI4OCAzNy4wOWw2LjA2LTMuNDk4YS4yMi4yMiAwIDAgMSAuMjA0LS4wMThsMTQuNDk0IDguMzdhMTMuNDk1IDEzLjQ5NSAwIDAgMS0yLjA4OCAyNC4zNDZWNDkuMjMzYTIuMzI4IDIuMzI4IDAgMCAwLTEuMTY3LTIuMDM3Wm02LjAzLTkuMDg0YTIwLjA2NCAyMC4wNjQgMCAwIDAtLjQyNS0uMjU0TDYwLjA2IDI5LjU3N2EyLjMzNyAyLjMzNyAwIDAgMC0yLjM1NSAwTDQwLjIwMyAzOS42ODN2LTYuOTk4YS4yMTguMjE4IDAgMCAxIC4wODYtLjE4NmwxNC40OTItOC4zNmExMy40OTUgMTMuNDk1IDAgMCAxIDIwLjA0IDEzLjk3M1pNMzYuOTA5IDUwLjU5bC02LjA2LTMuNDk5YS4yMS4yMSAwIDAgMS0uMTE4LS4xNjZWMzAuMTg3YTEzLjQ5NCAxMy40OTQgMCAwIDEgMjIuMTI4LTEwLjM2MWMtLjExLjA2LS4zLjE2NC0uNDI2LjI0bC0xNC4zMzYgOC4yODJhMi4zMzIgMi4zMzIgMCAwIDAtMS4xNzggMi4wMzhsLS4wMSAyMC4yMDRabTMuMjkyLTcuMDk3IDcuNzk1LTQuNTAzIDcuNzk2IDQuNXY5LjAwMmwtNy43OTYgNC40OTgtNy43OTUtNC41di04Ljk5N1oiLz4KPC9zdmc+Cg==`,
    title: 'GPT Image',
  },
  systemRole: `Whenever a description of an image is given, use lobe-image-designer to create the images, use exactly the same prompts that the user provides used to generate the images, no matter what language the user uses.`,
  type: 'builtin',
};
