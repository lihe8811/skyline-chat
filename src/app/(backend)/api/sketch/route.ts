import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { Buffer } from 'node:buffer';

import getTimestamp from '@/utils/getTimestamp';

export async function POST(req: NextRequest) {
  try {
    const { imageData } = await req.json();
    // Remove the Base64 header if it exists (e.g., 'data:image/png;base64,')
    const base64Image = imageData.split(';base64,').pop();

    if (!base64Image) {
        throw new Error('Invalid Base64 data');
    }
    const imageBuffer = Buffer.from(base64Image, 'base64');

    const outputDirPath = path.join(process.cwd(), 'public', 'sketch')
    if (!fs.existsSync(outputDirPath)) {
      fs.mkdirSync(outputDirPath, { recursive: true });
    }
    
    const fileName = `sketch_${getTimestamp()}.png`;
    const outputFilePath = path.join(outputDirPath, fileName);
    fs.writeFileSync(outputFilePath, imageBuffer);

    const imageUrl = `/sketch/${fileName}`;
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
  } 
}

export async function DELETE(req: NextRequest) {
  const { imageUrl } = await req.json();
  if (!imageUrl) {
    return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'public', 'sketch', imageUrl);
  fs.unlink(filePath, (error) => {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Error deleting file:' }, { status: 500 });
  });
}