import { getMatches } from '../match/match';
import { Match, MatchRequest } from '../match/types';
import { loadMatchRequest, supabase } from '../utils/supabase';
import styles from '../styles/Home.module.css';
import MatchesTable from '../components/matches';
import Layout from '../components/layout';
import { toTitle } from '../utils/utils';

function MatchPage({
  room,
  matchRequest,
  matches,
}: {
  room: string;
  matchRequest: MatchRequest;
  matches: Match[];
}) {
  return (
    <Layout title={toTitle(room)}>
      <div className={styles.main}>
        <h1 className={styles.title}>Matches</h1>
        <MatchesTable matches={matches} matchRequest={matchRequest} showConnect={false} />
      </div>
    </Layout>
  );
}

export const getServerSideProps = async (context: { query: { room: any }; req: any }) => {
  const { room } = context.query;
  const { data: matchRequest, error } = await loadMatchRequest(room);

  if (!matchRequest) {
    return {
      notFound: true,
    };
  }

  const user = await supabase.auth.api.getUserByCookie(context.req);

  if (!user.user && matchRequest.isPrivate) {
    return {
      notFound: true,
    };
  }

  try {
    const matches = await getMatches(matchRequest);
    return { props: { room, matchRequest, matches } };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default MatchPage;
