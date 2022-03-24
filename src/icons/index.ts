import Overview from './Dashboard/overview.svg'
import Project from './Dashboard/project.svg'
import Team from './Dashboard/team.svg'
import Settings from './Dashboard/settings.svg'
import Api from './Management/api.svg'
import Status from './Management/status.svg'
import User from './Management/user.svg'
import License from './Management/license.svg'
import Log from './Management/log.svg'
import Agent from './Management/agent.svg'
import Task from './Management/task.svg'
import AgentError from './Management/agent_error.svg'
import BaselineAudit from './Report/baseline_check.svg'
import DetailReport from './Report/detail_report.svg'
import RawData from './Report/overview.svg'
import ThreatAlert from './Report/threat_alert.svg'
import GlobalSearch from './Report/global_search.svg'
import AddOnCheck from './Report/add_on_check.svg'
import CommunicationAudit from './Report/communication_check.svg'
import FilesystemAudit from './Report/filesystem_check.svg'
import InformationAudit from './Report/information_check.svg'
import PermissionAudit from './Report/permission_check.svg'
import ServiceAudit from './Report/service_check.svg'
import SystemAudit from './Report/system_check.svg'
import SensitiveURL from './Report/sensitive_url.svg'
import SensitiveIP from './Report/sensitive_ip.svg'
import SensitiveEmail from './Report/sensitive_email.svg'
import SensitiveInfo from './Report/sensitive_info.svg'
import LicenseRequired from './License/required.svg'
import LicenseForbidden from './License/forbidden.svg'
import LicensePermitted from './License/permitted.svg'

export const Dashboard = {
  Overview,
  Project,
  Team,
  Settings,
}

export const Management = {
  Api,
  Status,
  User,
  License,
  Log,
  AgentError,
  Agent,
  Task,
  Settings,
}

export const LicenseIcon = {
  Required: LicenseRequired,
  Forbidden: LicenseForbidden,
  Permitted: LicensePermitted,
}

export const Report = {
  BaselineAudit,
  DetailReport,
  RawData,
  ThreatAlert,
  GlobalSearch,
  AddOnCheck,
  CommunicationAudit,
  FilesystemAudit,
  InformationAudit,
  PermissionAudit,
  ServiceAudit,
  SystemAudit,
  SensitiveURL,
  SensitiveIP,
  SensitiveEmail,
  SensitiveInfo,
}

export const ReportDict: Record<string, string> = Report
