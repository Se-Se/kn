import { UserPermission, AnalysisListItemFragment, AnalysisStatus } from 'generated/graphql';

export type Context = {
  teamAvailable: number
  isLicenseExpired: boolean
};
export const WritePerms = [UserPermission.TeamProjectWriteable];
export const LicenseNotExpired = (a: unknown, ctx?: Context): boolean => !ctx?.isLicenseExpired;
export const TeamAvailable = (a: unknown, ctx?: Context): boolean => ctx?.teamAvailable !== 0;
export const AnalysisStatusPending = (i: AnalysisListItemFragment): boolean => i.status === AnalysisStatus.Analyzing || i.status === AnalysisStatus.Preparing || i.status === AnalysisStatus.Waiting;
export const AnalysisStatusSuccess = (i: AnalysisListItemFragment[]): boolean => i[0].status === AnalysisStatus.Success;

