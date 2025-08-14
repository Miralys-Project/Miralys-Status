import './App.css';
import { useEffect, useState } from 'react';

function StatusCard({
  name,
  id,
  type,
  url,
  status,
}: {
  name: string;
  id?: string;
  type: 'discord' | 'website';
  url?: string;
  status?: 'online' | 'offline' | 'unknown';
}) {
  let statusText = 'Unknown';
  let statusClass = 'unknown';
  if (status === 'online') {
    statusText = 'Online';
    statusClass = 'online';
  } else if (status === 'offline' || status === 'unknown') {
    statusText = 'Offline';
    statusClass = 'offline';
  }
  return (
    <div className="status-card">
      <h2>{name}</h2>
      {type === 'discord' && id && (
        <p>
          <strong>Discord ID:</strong> {id}
        </p>
      )}
      {type === 'website' && url && (
        <p>
          <strong>Website:</strong>{' '}
          <a href={`https://${url}`} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </p>
      )}
      <span className={`status-indicator ${statusClass}`}>{statusText}</span>
    </div>
  );
}

const discordBots = [
  { name: 'Ayden', id: '1342880438523269272' },
  { name: 'Miralys Manager', id: '1399707511929700362' },
  { name: 'Miralys Tournament', id: '1404246305856819351' },
];

function App() {
  const [websiteStatus, setWebsiteStatus] = useState<
    'online' | 'offline' | 'unknown'
  >('unknown');
  const [botStatuses, setBotStatuses] = useState<
    Record<string, 'online' | 'offline' | 'unknown'>
  >({});

  useEffect(() => {
    async function checkWebsite() {
      try {
        await fetch('https://miralys.xyz', { method: 'HEAD', mode: 'no-cors' });
        setWebsiteStatus('online');
      } catch {
        setWebsiteStatus('offline');
      }
    }
    checkWebsite();
  }, []);

  useEffect(() => {
    async function fetchBotStatuses() {
      const statuses: Record<string, 'online' | 'offline' | 'unknown'> = {};
      await Promise.all(
        discordBots.map(async bot => {
          try {
            const res = await fetch(
              `https://api.status.miralys.xyz/bot-status/${bot.id}`,
            );
            const data = await res.json();
            statuses[bot.id] = data.status === 'online' ? 'online' : 'offline';
          } catch {
            statuses[bot.id] = 'unknown';
          }
        }),
      );
      setBotStatuses(statuses);
    }
    fetchBotStatuses();
  }, []);

  return (
    <div className="container">
      <h1>Miralys Status Page</h1>
      <div className="status-list">
        {discordBots.map(bot => (
          <StatusCard
            key={bot.id}
            name={bot.name}
            id={bot.id}
            type="discord"
            status={
              botStatuses[bot.id] === 'unknown'
                ? 'offline'
                : botStatuses[bot.id]
            }
          />
        ))}
        <StatusCard
          name="Miralys Website"
          url="miralys.xyz"
          type="website"
          status={websiteStatus}
        />
      </div>
    </div>
  );
}

export default App;
