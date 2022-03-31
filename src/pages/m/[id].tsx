import { supabaseServerClient, User } from '@supabase/supabase-auth-helpers/nextjs';
import { useEffect, useState } from 'react';
import Layout from '../../components/layout';
import MatchesTable from '../../components/matches';
import { Match, MatchRequest } from '../../match/types';
import { loadApplication, useRealtimeMatches } from '../../utils/supabase';
import { groupByDistinct, toTitle } from '../../utils/utils';
import styles from '../../styles/Home.module.css';
import { Application } from '../../types';

const EMPTY_MATCH_REQUEST: MatchRequest = {
  requestSpreadsheetId: '',
  requestSheetId: '',
  proposalSpreadsheetId: '',
  proposalSheetId: '',
};

interface Props {
  id: string;
  user: User;
  application: Application;
}

const MatchSubscription = (props: Props) => {
  const [payloads] = useRealtimeMatches(props.id);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const items = groupByDistinct(
      payloads,
      (r) => r.request_id,
      (r) => r.proposal_id
    );
    const newMatches: Match[] = Object.entries(items).map(([key, value]) => ({
      requestId: key,
      proposalIds: [...(value as any)],
    }));
    setMatches(newMatches);
  }, [payloads]);

  return (
    <Layout title={toTitle(props.id)}>
      <div className={styles.main}>
        <h1 className={styles.title}>Matches</h1>
        <MatchesTable matches={matches} matchRequest={EMPTY_MATCH_REQUEST} showConnect={false} />
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (context: { query: { id: any }; req: any }) => {
  const supabase = await supabaseServerClient(context);
  const { id } = context.query;
  const { data: application, error } = await loadApplication(id);

  if (!application) {
    return {
      notFound: true,
    };
  }

  const user = await supabase.auth.api.getUserByCookie(context.req);
  if (!user.user || user.user.id !== application.author) {
    return {
      notFound: true,
    };
  }

  return { props: { id, user: user.user, application } };
};

export default MatchSubscription;
