import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const playersFilePath = path.join(process.cwd(), "src", "data", "players.json");

export async function readPlayers() {
  const file = await readFile(playersFilePath, "utf8");
  return JSON.parse(file);
}

export async function addPlayerPoints(playerName, points) {
  const players = await readPlayers();
  let updatedPlayer = null;

  const updatedPlayers = players.map((player) => {
    if (player.name !== playerName) {
      return player;
    }

    updatedPlayer = {
      ...player,
      points: player.points + points,
    };

    return updatedPlayer;
  });

  if (!updatedPlayer) {
    return null;
  }

  await writeFile(playersFilePath, `${JSON.stringify(updatedPlayers, null, 2)}\n`);

  return {
    players: updatedPlayers,
    player: updatedPlayer,
  };
}

export function isLocalhostHost(host) {
  const value = (host || "").toLowerCase();
  const hostname = value.startsWith("[::1]")
    ? "::1"
    : value.split(":")[0];

  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}
