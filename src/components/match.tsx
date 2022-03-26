import { useState } from 'react';
import { Match, MatchRequest } from '../match/types';

const MatchComponent = ({
  match,
  request,
  showConnect,
}: {
  match: Match;
  request: MatchRequest;
  showConnect: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const requestWithMatch: MatchRequest = {
    ...request,
    requestIdsToFilter: [match.requestId],
    proposalIdsToFilter: match.proposalIds,
  };
  const handleConnect = async () => {
    setIsLoading(true);
    await fetch('/api/connect', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      body: JSON.stringify(requestWithMatch),
    });
    setIsLoading(false);
  };
  const showUrls = request.showUrls;

  return (
    <tr key={match.requestId}>
      {showUrls && (
        <>
          <td>
            {match.requestUrl ? (
              <a
                className="underline hover:text-blue-500 mt-4"
                href={`${match.requestUrl}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                {match.requestId}
              </a>
            ) : (
              match.requestId
            )}
          </td>
          <td>
            {match.proposalIds.map((id, index) =>
              !!match.proposalUrls?.[index] ? (
                <>
                  <a
                    key={id}
                    className="underline hover:text-blue-500 mt-4"
                    href={`${match.proposalUrls[index]}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {id}
                  </a>
                  {index !== match.proposalIds.length - 1 && ', '}
                </>
              ) : index === match.proposalIds.length - 1 ? (
                id
              ) : (
                `${id}, `
              )
            )}
          </td>
        </>
      )}
      {!showUrls && (
        <>
          <td>{match.requestId}</td>
          <td>{match.proposalIds.join(', ')}</td>
        </>
      )}

      {showConnect && (
        <td>
          <button disabled={isLoading} onClick={handleConnect}>
            {isLoading ? 'Connecting..' : 'Connect'}
          </button>
        </td>
      )}
    </tr>
  );
};

export default MatchComponent;
