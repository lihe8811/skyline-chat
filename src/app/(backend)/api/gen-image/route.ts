import { NextRequest, NextResponse } from 'next/server';

export interface SubmissionData {
  [key: string]: string;
  task: string;
}

const baseUrl = 'https://dashscope.aliyuncs.com/api/v1/services/aigc';
const apiKey = process.env.WANX_API_KEY;

export async function POST(req: NextRequest) {
  const data = await req.json();

  const submitJobUrlMap = new Map([
    ['text-to-image', '/text2image/image-synthesis'],
    ['sketch', '/image2image/image-synthesis/'],
    ['wordart', '/wordart/texture'],
  ]);

  const processSubmission = (data: SubmissionData) => {
    const url = `${baseUrl}${submitJobUrlMap.get(data.task)}`
    const body = data.task === 'sketch'
      ? {
          'input': {
            'sketch_image_url': data.sketchImage,
            'prompt': data.sketchPrompt,
          },
          'model': 'wanx-sketch-to-image-lite',
          'parameters': {
            'n': 1,
            'size': '768*768',
            'style': data.sketchStyle,
          }
        }
      : data.task === 'wordart'
        ? {
            'input': {
              'prompt': data.wordartPrompt,
              'text': {
                'font_name': data.wordartFont,
                'output_image_ratio': '1:1',
                'text_content': data.wordartText,
              },
              'texture_style': data.wordartStyle,
            },
            'model': 'wordart-texture',
            'parameters': {
              'alpha_channel': false,
              'n': 1,
              'image_short_size': 768,
            }
          }
        : {
            'model': 'wanx-v1',
            'input': {
              'prompt': data.regularPrompt,
            },
            'parameters': {
              'n': 1,
              'negative_prompt': data.regularNegativePrompt,
              'size': '1024*1024',
              'style': data.regularStyle,
            }
          }
    return { body, url }
  };

  const { body, url } = processSubmission(data);
  console.log(url);
  console.log(body);
  try {
    const response = await fetch(url, {
      body: JSON.stringify(body),
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-DashScope-Async': 'enable'
      },
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return NextResponse.json({ task_id: data.output.task_id });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}