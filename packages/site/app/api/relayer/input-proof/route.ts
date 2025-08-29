// app/api/relayer/input-proof/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { score, contractAddress, userAddress, chainId } = body;

    console.log('[API] Received request:', { score, contractAddress, userAddress, chainId });

    // TODO: Implement FHE encryption logic here
    // For now, return mock data to test the flow
    const mockHandles = ["0x" + "0".repeat(64)];
    const mockInputProof = "0x" + "0".repeat(100);

    console.log('[API] Returning mock data:', { handles: mockHandles, inputProof: mockInputProof });

    return NextResponse.json({
      handles: mockHandles,
      inputProof: mockInputProof
    });

  } catch (err) {
    console.error("Relayer proxy error:", err);
    return NextResponse.json({ 
      error: "Relayer proxy failed", 
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
