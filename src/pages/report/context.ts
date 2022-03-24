import { reportLink } from 'components/Link';
import { createContext, useContext } from 'react';

const AnalysisCtx = createContext<{
  teamName: string,
  projectName: string,
  analysisName: string,
  teamId: string,
  projectId: string,
  analysisId: string,
  reportId: string,
}>({
  teamName: '',
  projectName: '',
  analysisName: '',
  teamId: '',
  projectId: '',
  analysisId: '',
  reportId: '',
});

export const AnalysisCtxProvider = AnalysisCtx.Provider;
export const useAnalysisCtx = () => useContext(AnalysisCtx);
export const useAnalysisId = () => useContext(AnalysisCtx).analysisId;
export const useReportLink = () => {
  const { teamName: team, projectName: project, analysisName: analysis } = useAnalysisCtx();
  return ({ page, tab }: { page?: string, tab?: string }) => reportLink({
    team,
    project,
    analysis,
    page,
    tab,
  });
};
