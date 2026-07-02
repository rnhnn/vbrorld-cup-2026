import playersData from "@/data/players.json";
import { readPlayers } from "@/lib/players";

export default async function Home() {
  const showLocalToolbar = process.env.NODE_ENV === "development";
  const players = showLocalToolbar ? await readPlayers() : playersData;
  const ranking = [...players].sort((a, b) => b.points - a.points);
  const scores = [...new Set(ranking.map((player) => player.points))];
  const LocalhostScoreToolbar = showLocalToolbar
    ? (await import("./LocalhostScoreToolbar")).default
    : null;

  return (
    <main className="page">
      <h1 className="page-title">
        <span>V³BRO</span>
        <em>rld&nbsp;</em>
        <span> Cup 2026</span>
      </h1>

      <ol className="ranking" aria-label="VBRO Cup 2026 ranking">
        {ranking.map((player) => {
          const rank = scores.indexOf(player.points) + 1;

          return (
            <li className="ranking-item" key={player.name}>
              <div className="ranking-item-position">{rank}</div>

              <img
                src={player.avatar}
                alt=""
                className="ranking-item-avatar"
              />

              <div className="ranking-item-name">{player.name}</div>

              <div
                className={`ranking-item-score${
                  player.points > 9 ? " ranking-item-score-double" : ""
                }`}
              >
                <strong>{player.points}</strong>
                <span>PTS</span>
              </div>
            </li>
          );
        })}
      </ol>

      {LocalhostScoreToolbar ? (
        <LocalhostScoreToolbar players={players} />
      ) : null}
    </main>
  );
}
