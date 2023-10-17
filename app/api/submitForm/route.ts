import { NextRequest, NextResponse } from 'next/server';

const sampleFunction = (str: string) => str.toUpperCase();

export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.json();
  const input = data.data;

  const output = sampleFunction(input);
  return NextResponse.json({ output });
}
