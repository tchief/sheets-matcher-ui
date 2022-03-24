import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Match, MatchRequest } from '../match/types';
import styles from '../styles/Home.module.css';
import MatchesTable from '../components/matches';
import MatchesConfigComponent from '../components/config';
import { useUser } from '@supabase/supabase-auth-helpers/react';
import Layout from '../components/layout';

const Room: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchRequest, setMatchRequest] = useState<MatchRequest>({
    proposalSheetId: '',
    proposalSpreadsheetId: '',
    requestSheetId: '',
    requestSpreadsheetId: '',
  });

  const {
    config: showConfig = false,
    connect: showConnect = false,
    chatid: showChatId = false,
    save: showSaveConfig = false,
  } = router.query || {};

  return (
    <Layout>
      <div className={styles.main}>
        <h1 className={styles.title}>Match My Sheets</h1>
        {
          /*user &&*/ <MatchesConfigComponent
            showConfig={!!showConfig}
            showChatId={!!showChatId && !!user}
            showSaveConfig={!!user}
            matches={matches}
            setMatches={setMatches}
            matchRequest={matchRequest}
            setMatchRequest={setMatchRequest}
          />
        }
        <MatchesTable
          matches={matches}
          matchRequest={matchRequest}
          showConnect={!!showConnect && !!user}
        />
        {/* {user && (
        <>
          <button onClick={() => supabaseClient.auth.signOut()}>Sign out</button>
          <p>{user?.email}</p>
        </>
      )} */}
        <a
          className="underline hover:text-blue-500 mt-4"
          href={`${process.env.NEXT_PUBLIC_SUPPORT_URL}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          Support
        </a>
      </div>
    </Layout>
  );
};

export default Room;

// Uncomment to forbid access to index page for anon users.
//export const getServerSideProps = withAuthRequired({ redirectTo: '/login' });
