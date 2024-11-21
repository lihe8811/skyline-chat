import { NextRequest, NextResponse } from 'next/server';

const queryUrl = 'https://dashscope.aliyuncs.com/api/v1/tasks';
const apiKey = process.env.WANX_API_KEY;

export const fetchCache = 'force-no-store';

export async function GET(
  req: NextRequest,
  { params }: { params: { task_id: string } }
) {
  const { task_id } = params;
  const url = `${queryUrl}/${task_id}`;

  const headers = {
    'Cache-Control': 'no-store, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
  }

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    
    const data = await response.json();
    console.log(data);
    if (data.output.task_status === 'SUCCEEDED') {
      return NextResponse.json({ 
        headers: headers,
        task_status: data.output.task_status,
        url: data.output.results[0].url,
      });
    } else if (['SUSPENDED', 'FAILED', 'UNKNOWN'].includes(data.output.task_status)) {
      return NextResponse.json({ 
        error: data.output.task_status,
        headers: headers,
      });
    } else {
      return NextResponse.json({ 
        headers: headers,
        succeeded: data.output.task_metrics.SUCCEEDED,
        task_status: data.output.task_status,
        total: data.output.task_metrics.TOTAL,
      });
    }
  } catch(error) {
    return NextResponse.json({ 
      error: error,
      headers: headers,
    });
  }
}