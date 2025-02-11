import * as React from 'react';
import {
  useFetchClient,
  unstable_useContentManagerContext as useContentManagerContext,
} from '@strapi/strapi/admin';

function usePetApply() {
  const fetchClient = useFetchClient();

  const { model, id, isSingleType } = useContentManagerContext();

  const [status, setStatus] = React.useState('loading');
  const [petApplies, setPetApplies] = React.useState([]);

  const refetchPetApplies = React.useCallback(async () => {
    try {
      const { data } = await fetchClient.get(
        `/contract-strapi-plugin/${model}/getPetApply?documentId=${isSingleType ? '' : id}`
      );

      setPetApplies(data);
      setStatus('success');
    } catch (e) {
      setStatus('error');
    }
  }, [fetchClient, id, isSingleType, model]);

  React.useEffect(() => {
    refetchPetApplies();
  }, [id, isSingleType, setPetApplies, setStatus, refetchPetApplies]);

  return { status, petApplies, refetchPetApplies };
}

export default usePetApply;