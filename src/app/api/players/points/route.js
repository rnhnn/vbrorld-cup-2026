import { NextResponse } from "next/server";
import { addPlayerPoints, isLocalhostHost } from "@/lib/players";

const VALID_POINTS = new Set([3, 6]);

export async function POST(request) {
  if (!isLocalhostHost(request.headers.get("host"))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = typeof body?.name === "string" ? body.name : "";
  const points = Number(body?.points);

  if (!name || !VALID_POINTS.has(points)) {
    return NextResponse.json({ error: "Invalid score update" }, { status: 400 });
  }

  const result = await addPlayerPoints(name, points);

  if (!result) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
