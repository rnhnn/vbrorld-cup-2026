"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

export default function LocalhostScoreToolbar({ players }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [canRender, setCanRender] = useState(false);
  const [open, setOpen] = useState(true);
  const [busyKey, setBusyKey] = useState("");
  const [notice, setNotice] = useState("Local score dock");
  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => a.name.localeCompare(b.name)),
    [players],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCanRender(
        window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1" ||
          window.location.hostname === "::1",
      );
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function addPoints(name, points) {
    const actionKey = `${name}-${points}`;
    setBusyKey(actionKey);
    setNotice(`Adding ${points} to ${name}...`);

    try {
      const response = await fetch("/api/players/points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, points }),
      });

      if (!response.ok) {
        throw new Error("Score update failed");
      }

      const result = await response.json();
      setNotice(`${name} is now at ${result.player.points} pts`);
      startTransition(() => router.refresh());
    } catch {
      setNotice(`Could not update ${name}`);
    } finally {
      setBusyKey("");
    }
  }

  return canRender ? (
    <aside className={`score-dock${open ? " score-dock-open" : ""}`}>
      <button
        className="score-dock-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="score-dock-panel"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="score-dock-toggle-icon">{open ? "x" : "+"}</span>
        <span>Scores</span>
      </button>

      {open ? (
        <div className="score-dock-panel" id="score-dock-panel">
          <div className="score-dock-header">
            <div>
              <strong>Local scoring</strong>
              <span>{notice}</span>
            </div>
            {isPending ? <span className="score-dock-sync">Syncing</span> : null}
          </div>

          <div className="score-dock-list">
            {sortedPlayers.map((player) => (
              <div className="score-dock-player" key={player.name}>
                <div className="score-dock-player-main">
                  <img src={player.avatar} alt="" />
                  <div>
                    <strong>{player.name}</strong>
                    <span>{player.points} pts</span>
                  </div>
                </div>

                <div className="score-dock-actions">
                  {[3, 6].map((points) => {
                    const actionKey = `${player.name}-${points}`;
                    const isBusy = busyKey === actionKey;

                    return (
                      <button
                        type="button"
                        key={points}
                        disabled={Boolean(busyKey)}
                        onClick={() => addPoints(player.name, points)}
                      >
                        {isBusy ? "..." : `+${points}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  ) : null;
}
