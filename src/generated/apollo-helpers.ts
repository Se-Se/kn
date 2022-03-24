import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type QueryKeySpecifier = ('feature' | 'reportFeature' | 'dependence' | 'info' | 'viewer' | 'overview' | 'team' | 'teamByName' | 'node' | 'management' | 'userRole' | 'teamRole' | 'pickUser' | 'downloadToken' | 'expiredLicense' | 'token' | 'fetchTask' | 'sysMessage' | 'myItems' | 'teamOverview' | 'recentStatistics' | 'caseOfToolResult' | 'caseResultList' | 'projectTaskItemList' | 'myProjectStatistics' | 'projectList' | 'projectDetails' | 'changeProjectHistory' | 'caseResultDetail' | 'complianceResult' | 'lawCatalogueCheckDetail' | 'lawCatalogueDetail' | 'projectHeartBeat' | 'projectTaskStatusUpdate' | 'projectEventHeartBeat' | 'projectEventResultUpdate' | 'updateDeviceState' | 'registerDevice' | 'registerClient' | 'sendHeartbeat' | 'getCaseStepDetail' | 'getCaseAllStep' | 'getCatalogueDetail' | 'updateSysMessage' | 'getStepResult' | 'getProjectAutoTaskProgress' | 'getProjectAutoTaskProgressV2' | 'checkSelectDeviceOnlineHeartBeat' | 'changeCaseHistory' | 'getLawList' | 'carInfoList' | 'lawDetail' | 'getApkSelectorList' | 'getUserCustomCaseSuiteList' | 'getUserCustomCaseListBySuiteId' | 'getUserCustomSuiteType' | 'reportViewAction' | 'getAllCaseList' | 'getCaseStaticCheckedItems' | 'getCarInfoList' | 'getCarInfoListSelector' | 'getCarStaticComponent' | 'getCommonalityAutoTaskReport' | 'GetSuiteWithCaseIds' | 'getOnlineUsbDeviceList' | 'getMyProjectStatistics' | 'getUserSelectorList' | 'checkProjectReportStatus' | 'clientEventAlert' | 'caseAllInfo' | 'projectSelectorList' | 'checkDeviceOnline' | 'caseTestProcessRecord' | 'checkDeviceHeartbeat' | 'exchangeLinuxDeviceConnectMsg' | 'realtimeGetApkInfo' | 'unBindDevice' | 'getSelectedAppList' | 'getAnalysisAppList' | 'cancelDeviceOnlineAlert' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	feature?: FieldPolicy<any> | FieldReadFunction<any>,
	reportFeature?: FieldPolicy<any> | FieldReadFunction<any>,
	dependence?: FieldPolicy<any> | FieldReadFunction<any>,
	info?: FieldPolicy<any> | FieldReadFunction<any>,
	viewer?: FieldPolicy<any> | FieldReadFunction<any>,
	overview?: FieldPolicy<any> | FieldReadFunction<any>,
	team?: FieldPolicy<any> | FieldReadFunction<any>,
	teamByName?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	management?: FieldPolicy<any> | FieldReadFunction<any>,
	userRole?: FieldPolicy<any> | FieldReadFunction<any>,
	teamRole?: FieldPolicy<any> | FieldReadFunction<any>,
	pickUser?: FieldPolicy<any> | FieldReadFunction<any>,
	downloadToken?: FieldPolicy<any> | FieldReadFunction<any>,
	expiredLicense?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	fetchTask?: FieldPolicy<any> | FieldReadFunction<any>,
	sysMessage?: FieldPolicy<any> | FieldReadFunction<any>,
	myItems?: FieldPolicy<any> | FieldReadFunction<any>,
	teamOverview?: FieldPolicy<any> | FieldReadFunction<any>,
	recentStatistics?: FieldPolicy<any> | FieldReadFunction<any>,
	caseOfToolResult?: FieldPolicy<any> | FieldReadFunction<any>,
	caseResultList?: FieldPolicy<any> | FieldReadFunction<any>,
	projectTaskItemList?: FieldPolicy<any> | FieldReadFunction<any>,
	myProjectStatistics?: FieldPolicy<any> | FieldReadFunction<any>,
	projectList?: FieldPolicy<any> | FieldReadFunction<any>,
	projectDetails?: FieldPolicy<any> | FieldReadFunction<any>,
	changeProjectHistory?: FieldPolicy<any> | FieldReadFunction<any>,
	caseResultDetail?: FieldPolicy<any> | FieldReadFunction<any>,
	complianceResult?: FieldPolicy<any> | FieldReadFunction<any>,
	lawCatalogueCheckDetail?: FieldPolicy<any> | FieldReadFunction<any>,
	lawCatalogueDetail?: FieldPolicy<any> | FieldReadFunction<any>,
	projectHeartBeat?: FieldPolicy<any> | FieldReadFunction<any>,
	projectTaskStatusUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	projectEventHeartBeat?: FieldPolicy<any> | FieldReadFunction<any>,
	projectEventResultUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	updateDeviceState?: FieldPolicy<any> | FieldReadFunction<any>,
	registerDevice?: FieldPolicy<any> | FieldReadFunction<any>,
	registerClient?: FieldPolicy<any> | FieldReadFunction<any>,
	sendHeartbeat?: FieldPolicy<any> | FieldReadFunction<any>,
	getCaseStepDetail?: FieldPolicy<any> | FieldReadFunction<any>,
	getCaseAllStep?: FieldPolicy<any> | FieldReadFunction<any>,
	getCatalogueDetail?: FieldPolicy<any> | FieldReadFunction<any>,
	updateSysMessage?: FieldPolicy<any> | FieldReadFunction<any>,
	getStepResult?: FieldPolicy<any> | FieldReadFunction<any>,
	getProjectAutoTaskProgress?: FieldPolicy<any> | FieldReadFunction<any>,
	getProjectAutoTaskProgressV2?: FieldPolicy<any> | FieldReadFunction<any>,
	checkSelectDeviceOnlineHeartBeat?: FieldPolicy<any> | FieldReadFunction<any>,
	changeCaseHistory?: FieldPolicy<any> | FieldReadFunction<any>,
	getLawList?: FieldPolicy<any> | FieldReadFunction<any>,
	carInfoList?: FieldPolicy<any> | FieldReadFunction<any>,
	lawDetail?: FieldPolicy<any> | FieldReadFunction<any>,
	getApkSelectorList?: FieldPolicy<any> | FieldReadFunction<any>,
	getUserCustomCaseSuiteList?: FieldPolicy<any> | FieldReadFunction<any>,
	getUserCustomCaseListBySuiteId?: FieldPolicy<any> | FieldReadFunction<any>,
	getUserCustomSuiteType?: FieldPolicy<any> | FieldReadFunction<any>,
	reportViewAction?: FieldPolicy<any> | FieldReadFunction<any>,
	getAllCaseList?: FieldPolicy<any> | FieldReadFunction<any>,
	getCaseStaticCheckedItems?: FieldPolicy<any> | FieldReadFunction<any>,
	getCarInfoList?: FieldPolicy<any> | FieldReadFunction<any>,
	getCarInfoListSelector?: FieldPolicy<any> | FieldReadFunction<any>,
	getCarStaticComponent?: FieldPolicy<any> | FieldReadFunction<any>,
	getCommonalityAutoTaskReport?: FieldPolicy<any> | FieldReadFunction<any>,
	GetSuiteWithCaseIds?: FieldPolicy<any> | FieldReadFunction<any>,
	getOnlineUsbDeviceList?: FieldPolicy<any> | FieldReadFunction<any>,
	getMyProjectStatistics?: FieldPolicy<any> | FieldReadFunction<any>,
	getUserSelectorList?: FieldPolicy<any> | FieldReadFunction<any>,
	checkProjectReportStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	clientEventAlert?: FieldPolicy<any> | FieldReadFunction<any>,
	caseAllInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	projectSelectorList?: FieldPolicy<any> | FieldReadFunction<any>,
	checkDeviceOnline?: FieldPolicy<any> | FieldReadFunction<any>,
	caseTestProcessRecord?: FieldPolicy<any> | FieldReadFunction<any>,
	checkDeviceHeartbeat?: FieldPolicy<any> | FieldReadFunction<any>,
	exchangeLinuxDeviceConnectMsg?: FieldPolicy<any> | FieldReadFunction<any>,
	realtimeGetApkInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	unBindDevice?: FieldPolicy<any> | FieldReadFunction<any>,
	getSelectedAppList?: FieldPolicy<any> | FieldReadFunction<any>,
	getAnalysisAppList?: FieldPolicy<any> | FieldReadFunction<any>,
	cancelDeviceOnlineAlert?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FeatureConfigKeySpecifier = ('systemLinux' | 'systemAndroid' | 'systemOther' | 'artifactAPK' | 'artifactRTOS' | 'artifactPackage' | 'artifactDocker' | 'uploadPackage' | 'uploadRTOSFirmware' | 'uploadImage' | 'uploadCDat' | 'uploadAPK' | 'uploadDockerImage' | 'plugin' | 'collector' | 'timesLimitEnabled' | FeatureConfigKeySpecifier)[];
export type FeatureConfigFieldPolicy = {
	systemLinux?: FieldPolicy<any> | FieldReadFunction<any>,
	systemAndroid?: FieldPolicy<any> | FieldReadFunction<any>,
	systemOther?: FieldPolicy<any> | FieldReadFunction<any>,
	artifactAPK?: FieldPolicy<any> | FieldReadFunction<any>,
	artifactRTOS?: FieldPolicy<any> | FieldReadFunction<any>,
	artifactPackage?: FieldPolicy<any> | FieldReadFunction<any>,
	artifactDocker?: FieldPolicy<any> | FieldReadFunction<any>,
	uploadPackage?: FieldPolicy<any> | FieldReadFunction<any>,
	uploadRTOSFirmware?: FieldPolicy<any> | FieldReadFunction<any>,
	uploadImage?: FieldPolicy<any> | FieldReadFunction<any>,
	uploadCDat?: FieldPolicy<any> | FieldReadFunction<any>,
	uploadAPK?: FieldPolicy<any> | FieldReadFunction<any>,
	uploadDockerImage?: FieldPolicy<any> | FieldReadFunction<any>,
	plugin?: FieldPolicy<any> | FieldReadFunction<any>,
	collector?: FieldPolicy<any> | FieldReadFunction<any>,
	timesLimitEnabled?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReportFeatureConfigKeySpecifier = ('baseline' | 'custom' | 'cveSec' | 'cveKernel' | 'license' | 'detail' | 'sensitive' | 'risk' | ReportFeatureConfigKeySpecifier)[];
export type ReportFeatureConfigFieldPolicy = {
	baseline?: FieldPolicy<any> | FieldReadFunction<any>,
	custom?: FieldPolicy<any> | FieldReadFunction<any>,
	cveSec?: FieldPolicy<any> | FieldReadFunction<any>,
	cveKernel?: FieldPolicy<any> | FieldReadFunction<any>,
	license?: FieldPolicy<any> | FieldReadFunction<any>,
	detail?: FieldPolicy<any> | FieldReadFunction<any>,
	sensitive?: FieldPolicy<any> | FieldReadFunction<any>,
	risk?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DependenceKeySpecifier = ('latex' | DependenceKeySpecifier)[];
export type DependenceFieldPolicy = {
	latex?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserKeySpecifier = ('id' | 'username' | 'nickname' | 'userRole' | 'teamRole' | 'lastLoginTime' | UserKeySpecifier)[];
export type UserFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	username?: FieldPolicy<any> | FieldReadFunction<any>,
	nickname?: FieldPolicy<any> | FieldReadFunction<any>,
	userRole?: FieldPolicy<any> | FieldReadFunction<any>,
	teamRole?: FieldPolicy<any> | FieldReadFunction<any>,
	lastLoginTime?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RoleKeySpecifier = ('id' | 'name' | 'permissions' | RoleKeySpecifier)[];
export type RoleFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	permissions?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OverviewKeySpecifier = ('status' | 'risk' | 'team' | 'recentEvent' | OverviewKeySpecifier)[];
export type OverviewFieldPolicy = {
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	risk?: FieldPolicy<any> | FieldReadFunction<any>,
	team?: FieldPolicy<any> | FieldReadFunction<any>,
	recentEvent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CommonStatusStatisticsKeySpecifier = ('status' | 'count' | CommonStatusStatisticsKeySpecifier)[];
export type CommonStatusStatisticsFieldPolicy = {
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AllRiskStatisticsKeySpecifier = ('baseline' | 'custom' | 'cve' | 'license' | AllRiskStatisticsKeySpecifier)[];
export type AllRiskStatisticsFieldPolicy = {
	baseline?: FieldPolicy<any> | FieldReadFunction<any>,
	custom?: FieldPolicy<any> | FieldReadFunction<any>,
	cve?: FieldPolicy<any> | FieldReadFunction<any>,
	license?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckRiskStatisticsKeySpecifier = ('risk' | 'count' | CheckRiskStatisticsKeySpecifier)[];
export type CheckRiskStatisticsFieldPolicy = {
	risk?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CvssRankStatisticsKeySpecifier = ('risk' | 'count' | CvssRankStatisticsKeySpecifier)[];
export type CvssRankStatisticsFieldPolicy = {
	risk?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LicenseRiskStatisticsKeySpecifier = ('risk' | 'count' | LicenseRiskStatisticsKeySpecifier)[];
export type LicenseRiskStatisticsFieldPolicy = {
	risk?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TeamStatisticsKeySpecifier = ('name' | 'project' | 'risk' | 'timesLimit' | TeamStatisticsKeySpecifier)[];
export type TeamStatisticsFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	project?: FieldPolicy<any> | FieldReadFunction<any>,
	risk?: FieldPolicy<any> | FieldReadFunction<any>,
	timesLimit?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LimitKeySpecifier = ('total' | 'allocated' | 'unallocated' | 'used' | 'available' | LimitKeySpecifier)[];
export type LimitFieldPolicy = {
	total?: FieldPolicy<any> | FieldReadFunction<any>,
	allocated?: FieldPolicy<any> | FieldReadFunction<any>,
	unallocated?: FieldPolicy<any> | FieldReadFunction<any>,
	used?: FieldPolicy<any> | FieldReadFunction<any>,
	available?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProjectKeySpecifier = ('id' | 'deleteTime' | 'name' | 'team' | 'risk' | 'status' | 'analysisStatus' | 'description' | 'analysis' | 'analysisByName' | 'time' | 'caseResultCount' | 'caseResultIgnoreCount' | ProjectKeySpecifier)[];
export type ProjectFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteTime?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	team?: FieldPolicy<any> | FieldReadFunction<any>,
	risk?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	analysisStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	analysis?: FieldPolicy<any> | FieldReadFunction<any>,
	analysisByName?: FieldPolicy<any> | FieldReadFunction<any>,
	time?: FieldPolicy<any> | FieldReadFunction<any>,
	caseResultCount?: FieldPolicy<any> | FieldReadFunction<any>,
	caseResultIgnoreCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type NodeKeySpecifier = ('id' | NodeKeySpecifier)[];
export type NodeFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TeamKeySpecifier = ('id' | 'name' | 'createTime' | 'timesLimit' | 'viewerRole' | 'overview' | 'project' | 'manager' | 'projectByName' | TeamKeySpecifier)[];
export type TeamFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	createTime?: FieldPolicy<any> | FieldReadFunction<any>,
	timesLimit?: FieldPolicy<any> | FieldReadFunction<any>,
	viewerRole?: FieldPolicy<any> | FieldReadFunction<any>,
	overview?: FieldPolicy<any> | FieldReadFunction<any>,
	project?: FieldPolicy<any> | FieldReadFunction<any>,
	manager?: FieldPolicy<any> | FieldReadFunction<any>,
	projectByName?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TeamOverviewKeySpecifier = ('status' | 'risk' | 'recentEvent' | TeamOverviewKeySpecifier)[];
export type TeamOverviewFieldPolicy = {
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	risk?: FieldPolicy<any> | FieldReadFunction<any>,
	recentEvent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProjectConnectionKeySpecifier = ('nodes' | 'fieldValues' | 'totalCount' | ProjectConnectionKeySpecifier)[];
export type ProjectConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	fieldValues?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TeamManagerKeySpecifier = ('user' | 'task' | TeamManagerKeySpecifier)[];
export type TeamManagerFieldPolicy = {
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	task?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserConnectionKeySpecifier = ('nodes' | 'fieldValues' | 'totalCount' | UserConnectionKeySpecifier)[];
export type UserConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	fieldValues?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaskConnectionKeySpecifier = ('nodes' | 'fieldValues' | 'totalCount' | TaskConnectionKeySpecifier)[];
export type TaskConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	fieldValues?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaskKeySpecifier = ('id' | 'analysis' | 'agent' | 'status' | 'command' | 'time' | 'displayID' | 'userName' | 'teamName' | 'projectName' | TaskKeySpecifier)[];
export type TaskFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	analysis?: FieldPolicy<any> | FieldReadFunction<any>,
	agent?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	command?: FieldPolicy<any> | FieldReadFunction<any>,
	time?: FieldPolicy<any> | FieldReadFunction<any>,
	displayID?: FieldPolicy<any> | FieldReadFunction<any>,
	userName?: FieldPolicy<any> | FieldReadFunction<any>,
	teamName?: FieldPolicy<any> | FieldReadFunction<any>,
	projectName?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AnalysisKeySpecifier = ('id' | 'displayID' | 'deleteTime' | 'name' | 'status' | 'risk' | 'description' | 'time' | 'report' | 'project' | 'file' | 'logSubID' | 'analysisType' | 'collector' | 'collectorByName' | 'customAudit' | 'setting' | AnalysisKeySpecifier)[];
export type AnalysisFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	displayID?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteTime?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	risk?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	time?: FieldPolicy<any> | FieldReadFunction<any>,
	report?: FieldPolicy<any> | FieldReadFunction<any>,
	project?: FieldPolicy<any> | FieldReadFunction<any>,
	file?: FieldPolicy<any> | FieldReadFunction<any>,
	logSubID?: FieldPolicy<any> | FieldReadFunction<any>,
	analysisType?: FieldPolicy<any> | FieldReadFunction<any>,
	collector?: FieldPolicy<any> | FieldReadFunction<any>,
	collectorByName?: FieldPolicy<any> | FieldReadFunction<any>,
	customAudit?: FieldPolicy<any> | FieldReadFunction<any>,
	setting?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SysReportKeySpecifier = ('id' | 'overview' | 'system' | 'threatAlert' | 'listAudit' | 'auditReport' | 'audit' | 'sensitiveInfo' | 'license' | 'procRisk' | 'androidRisk' | 'ruleByID' | 'position' | SysReportKeySpecifier)[];
export type SysReportFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	overview?: FieldPolicy<any> | FieldReadFunction<any>,
	system?: FieldPolicy<any> | FieldReadFunction<any>,
	threatAlert?: FieldPolicy<any> | FieldReadFunction<any>,
	listAudit?: FieldPolicy<any> | FieldReadFunction<any>,
	auditReport?: FieldPolicy<any> | FieldReadFunction<any>,
	audit?: FieldPolicy<any> | FieldReadFunction<any>,
	sensitiveInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	license?: FieldPolicy<any> | FieldReadFunction<any>,
	procRisk?: FieldPolicy<any> | FieldReadFunction<any>,
	androidRisk?: FieldPolicy<any> | FieldReadFunction<any>,
	ruleByID?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReportOverviewKeySpecifier = ('baseline' | 'baselineSecureScore' | 'custom' | 'threatAlert' | 'cve' | 'license' | ReportOverviewKeySpecifier)[];
export type ReportOverviewFieldPolicy = {
	baseline?: FieldPolicy<any> | FieldReadFunction<any>,
	baselineSecureScore?: FieldPolicy<any> | FieldReadFunction<any>,
	custom?: FieldPolicy<any> | FieldReadFunction<any>,
	threatAlert?: FieldPolicy<any> | FieldReadFunction<any>,
	cve?: FieldPolicy<any> | FieldReadFunction<any>,
	license?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CommonRiskStatisticsKeySpecifier = ('risk' | 'count' | CommonRiskStatisticsKeySpecifier)[];
export type CommonRiskStatisticsFieldPolicy = {
	risk?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SystemKeySpecifier = ('kernel' | 'buddyInfo' | 'crypto' | 'supportedfs' | 'hosts' | 'user' | 'group' | 'network' | 'file' | 'storagePartition' | 'process' | 'storageUsage' | 'storageMount' | 'libCveSec' | 'kernelCveSec' | 'checkSec' | 'command' | 'usb' | SystemKeySpecifier)[];
export type SystemFieldPolicy = {
	kernel?: FieldPolicy<any> | FieldReadFunction<any>,
	buddyInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	crypto?: FieldPolicy<any> | FieldReadFunction<any>,
	supportedfs?: FieldPolicy<any> | FieldReadFunction<any>,
	hosts?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	group?: FieldPolicy<any> | FieldReadFunction<any>,
	network?: FieldPolicy<any> | FieldReadFunction<any>,
	file?: FieldPolicy<any> | FieldReadFunction<any>,
	storagePartition?: FieldPolicy<any> | FieldReadFunction<any>,
	process?: FieldPolicy<any> | FieldReadFunction<any>,
	storageUsage?: FieldPolicy<any> | FieldReadFunction<any>,
	storageMount?: FieldPolicy<any> | FieldReadFunction<any>,
	libCveSec?: FieldPolicy<any> | FieldReadFunction<any>,
	kernelCveSec?: FieldPolicy<any> | FieldReadFunction<any>,
	checkSec?: FieldPolicy<any> | FieldReadFunction<any>,
	command?: FieldPolicy<any> | FieldReadFunction<any>,
	usb?: FieldPolicy<any> | FieldReadFunction<any>
};
export type KernelKeySpecifier = ('name' | 'release' | 'version' | 'cmdline' | 'procVersion' | 'errDescription' | KernelKeySpecifier)[];
export type KernelFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	release?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	cmdline?: FieldPolicy<any> | FieldReadFunction<any>,
	procVersion?: FieldPolicy<any> | FieldReadFunction<any>,
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ErrDescriptionKeySpecifier = ('errDescription' | ErrDescriptionKeySpecifier)[];
export type ErrDescriptionFieldPolicy = {
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BuddyInfoConnectionKeySpecifier = ('nodes' | 'totalCount' | BuddyInfoConnectionKeySpecifier)[];
export type BuddyInfoConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BuddyInfoKeySpecifier = ('node' | 'zone' | 'freePageBlock' | 'errDescription' | BuddyInfoKeySpecifier)[];
export type BuddyInfoFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	zone?: FieldPolicy<any> | FieldReadFunction<any>,
	freePageBlock?: FieldPolicy<any> | FieldReadFunction<any>,
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CryptoConnectionKeySpecifier = ('nodes' | 'fieldValues' | 'totalCount' | CryptoConnectionKeySpecifier)[];
export type CryptoConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	fieldValues?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CryptoKeySpecifier = ('driver' | 'module' | 'priority' | 'refCnt' | 'selfTest' | 'internal' | 'type' | 'errDescription' | CryptoKeySpecifier)[];
export type CryptoFieldPolicy = {
	driver?: FieldPolicy<any> | FieldReadFunction<any>,
	module?: FieldPolicy<any> | FieldReadFunction<any>,
	priority?: FieldPolicy<any> | FieldReadFunction<any>,
	refCnt?: FieldPolicy<any> | FieldReadFunction<any>,
	selfTest?: FieldPolicy<any> | FieldReadFunction<any>,
	internal?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SupportedfsConnectionKeySpecifier = ('nodes' | 'fieldValues' | 'totalCount' | SupportedfsConnectionKeySpecifier)[];
export type SupportedfsConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	fieldValues?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SupportedfsKeySpecifier = ('dev' | 'type' | 'errDescription' | SupportedfsKeySpecifier)[];
export type SupportedfsFieldPolicy = {
	dev?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type HostConnectionKeySpecifier = ('nodes' | 'totalCount' | HostConnectionKeySpecifier)[];
export type HostConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type HostKeySpecifier = ('address' | 'hostname' | 'errDescription' | HostKeySpecifier)[];
export type HostFieldPolicy = {
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	hostname?: FieldPolicy<any> | FieldReadFunction<any>,
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SystemUserConnectionKeySpecifier = ('nodes' | 'totalCount' | SystemUserConnectionKeySpecifier)[];
export type SystemUserConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SystemUserKeySpecifier = ('uid' | 'userName' | 'gid' | 'shell' | 'passwordHash' | 'errDescription' | SystemUserKeySpecifier)[];
export type SystemUserFieldPolicy = {
	uid?: FieldPolicy<any> | FieldReadFunction<any>,
	userName?: FieldPolicy<any> | FieldReadFunction<any>,
	gid?: FieldPolicy<any> | FieldReadFunction<any>,
	shell?: FieldPolicy<any> | FieldReadFunction<any>,
	passwordHash?: FieldPolicy<any> | FieldReadFunction<any>,
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GroupConnectionKeySpecifier = ('nodes' | 'totalCount' | GroupConnectionKeySpecifier)[];
export type GroupConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GroupKeySpecifier = ('gid' | 'groupName' | 'groupPassword' | 'userList' | 'errDescription' | GroupKeySpecifier)[];
export type GroupFieldPolicy = {
	gid?: FieldPolicy<any> | FieldReadFunction<any>,
	groupName?: FieldPolicy<any> | FieldReadFunction<any>,
	groupPassword?: FieldPolicy<any> | FieldReadFunction<any>,
	userList?: FieldPolicy<any> | FieldReadFunction<any>,
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type NetworkKeySpecifier = ('interface' | 'routing' | 'unixSocket' | 'listeningSocket' | 'connectingSocket' | NetworkKeySpecifier)[];
export type NetworkFieldPolicy = {
	interface?: FieldPolicy<any> | FieldReadFunction<any>,
	routing?: FieldPolicy<any> | FieldReadFunction<any>,
	unixSocket?: FieldPolicy<any> | FieldReadFunction<any>,
	listeningSocket?: FieldPolicy<any> | FieldReadFunction<any>,
	connectingSocket?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InterfaceConnectionKeySpecifier = ('nodes' | 'totalCount' | InterfaceConnectionKeySpecifier)[];
export type InterfaceConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InterfaceKeySpecifier = ('name' | 'ipv4Address' | 'ipv6Address' | 'phyAddress' | 'errDescription' | InterfaceKeySpecifier)[];
export type InterfaceFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	ipv4Address?: FieldPolicy<any> | FieldReadFunction<any>,
	ipv6Address?: FieldPolicy<any> | FieldReadFunction<any>,
	phyAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RoutingConnectionKeySpecifier = ('nodes' | 'fieldValues' | 'totalCount' | RoutingConnectionKeySpecifier)[];
export type RoutingConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	fieldValues?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RoutingKeySpecifier = ('table' | 'destination' | 'mask' | 'gateway' | 'interfaceName' | 'errDescription' | RoutingKeySpecifier)[];
export type RoutingFieldPolicy = {
	table?: FieldPolicy<any> | FieldReadFunction<any>,
	destination?: FieldPolicy<any> | FieldReadFunction<any>,
	mask?: FieldPolicy<any> | FieldReadFunction<any>,
	gateway?: FieldPolicy<any> | FieldReadFunction<any>,
	interfaceName?: FieldPolicy<any> | FieldReadFunction<any>,
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UnixSocketConnectionKeySpecifier = ('nodes' | 'totalCount' | UnixSocketConnectionKeySpecifier)[];
export type UnixSocketConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UnixSocketKeySpecifier = ('inode' | 'path' | 'processName' | 'pid' | 'errDescription' | UnixSocketKeySpecifier)[];
export type UnixSocketFieldPolicy = {
	inode?: FieldPolicy<any> | FieldReadFunction<any>,
	path?: FieldPolicy<any> | FieldReadFunction<any>,
	processName?: FieldPolicy<any> | FieldReadFunction<any>,
	pid?: FieldPolicy<any> | FieldReadFunction<any>,
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SocketConnectionKeySpecifier = ('nodes' | 'fieldValues' | 'totalCount' | SocketConnectionKeySpecifier)[];
export type SocketConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	fieldValues?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SocketKeySpecifier = ('localAddress' | 'localPort' | 'remoteAddress' | 'remotePort' | 'inode' | 'processName' | 'pid' | 'type' | 'errDescription' | SocketKeySpecifier)[];
export type SocketFieldPolicy = {
	localAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	localPort?: FieldPolicy<any> | FieldReadFunction<any>,
	remoteAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	remotePort?: FieldPolicy<any> | FieldReadFunction<any>,
	inode?: FieldPolicy<any> | FieldReadFunction<any>,
	processName?: FieldPolicy<any> | FieldReadFunction<any>,
	pid?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FileConnectionKeySpecifier = ('nodes' | 'fieldValues' | 'totalCount' | FileConnectionKeySpecifier)[];
export type FileConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	fieldValues?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FileKeySpecifier = ('id' | 'name' | 'type' | 'perm' | 'ownerUser' | 'ownerGroup' | 'size' | 'nodes' | 'aclEnabled' | 'linkCount' | 'linkFile' | 'date' | 'content' | 'contentType' | 'virtual' | 'arch' | 'errDescription' | FileKeySpecifier)[];
export type FileFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	perm?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerUser?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerGroup?: FieldPolicy<any> | FieldReadFunction<any>,
	size?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	aclEnabled?: FieldPolicy<any> | FieldReadFunction<any>,
	linkCount?: FieldPolicy<any> | FieldReadFunction<any>,
	linkFile?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	contentType?: FieldPolicy<any> | FieldReadFunction<any>,
	virtual?: FieldPolicy<any> | FieldReadFunction<any>,
	arch?: FieldPolicy<any> | FieldReadFunction<any>,
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StoragePartitionConnectionKeySpecifier = ('nodes' | 'totalCount' | StoragePartitionConnectionKeySpecifier)[];
export type StoragePartitionConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StoragePartitionKeySpecifier = ('name' | 'size' | 'node' | 'errDescription' | StoragePartitionKeySpecifier)[];
export type StoragePartitionFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	size?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProcessConnectionKeySpecifier = ('nodes' | 'totalCount' | ProcessConnectionKeySpecifier)[];
export type ProcessConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProcessKeySpecifier = ('id' | 'name' | 'pid' | 'uid' | 'gid' | 'cmd' | 'cwd' | 'memmap' | 'loginUID' | 'status' | 'rootDir' | 'fileHandles' | 'environment' | 'inodes' | 'sharelibs' | 'apk' | 'errDescription' | ProcessKeySpecifier)[];
export type ProcessFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	pid?: FieldPolicy<any> | FieldReadFunction<any>,
	uid?: FieldPolicy<any> | FieldReadFunction<any>,
	gid?: FieldPolicy<any> | FieldReadFunction<any>,
	cmd?: FieldPolicy<any> | FieldReadFunction<any>,
	cwd?: FieldPolicy<any> | FieldReadFunction<any>,
	memmap?: FieldPolicy<any> | FieldReadFunction<any>,
	loginUID?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	rootDir?: FieldPolicy<any> | FieldReadFunction<any>,
	fileHandles?: FieldPolicy<any> | FieldReadFunction<any>,
	environment?: FieldPolicy<any> | FieldReadFunction<any>,
	inodes?: FieldPolicy<any> | FieldReadFunction<any>,
	sharelibs?: FieldPolicy<any> | FieldReadFunction<any>,
	apk?: FieldPolicy<any> | FieldReadFunction<any>,
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProcessStatusKeySpecifier = ('name' | 'seccomp' | 'ppid' | ProcessStatusKeySpecifier)[];
export type ProcessStatusFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	seccomp?: FieldPolicy<any> | FieldReadFunction<any>,
	ppid?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SharelibKeySpecifier = ('name' | SharelibKeySpecifier)[];
export type SharelibFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StorageUsageConnectionKeySpecifier = ('nodes' | 'totalCount' | StorageUsageConnectionKeySpecifier)[];
export type StorageUsageConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StorageUsageKeySpecifier = ('filesystem' | 'total' | 'used' | 'available' | 'usePercent' | 'mountOn' | 'errDescription' | StorageUsageKeySpecifier)[];
export type StorageUsageFieldPolicy = {
	filesystem?: FieldPolicy<any> | FieldReadFunction<any>,
	total?: FieldPolicy<any> | FieldReadFunction<any>,
	used?: FieldPolicy<any> | FieldReadFunction<any>,
	available?: FieldPolicy<any> | FieldReadFunction<any>,
	usePercent?: FieldPolicy<any> | FieldReadFunction<any>,
	mountOn?: FieldPolicy<any> | FieldReadFunction<any>,
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StorageMountConnectionKeySpecifier = ('nodes' | 'totalCount' | StorageMountConnectionKeySpecifier)[];
export type StorageMountConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StorageMountKeySpecifier = ('device' | 'mountPoint' | 'fsType' | 'option' | 'errDescription' | StorageMountKeySpecifier)[];
export type StorageMountFieldPolicy = {
	device?: FieldPolicy<any> | FieldReadFunction<any>,
	mountPoint?: FieldPolicy<any> | FieldReadFunction<any>,
	fsType?: FieldPolicy<any> | FieldReadFunction<any>,
	option?: FieldPolicy<any> | FieldReadFunction<any>,
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CVESecConnectionKeySpecifier = ('nodes' | 'fieldValues' | 'totalCount' | CVESecConnectionKeySpecifier)[];
export type CVESecConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	fieldValues?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CVESecKeySpecifier = ('component' | 'version' | 'description' | 'path' | 'risk' | 'cve' | 'errDescription' | CVESecKeySpecifier)[];
export type CVESecFieldPolicy = {
	component?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	path?: FieldPolicy<any> | FieldReadFunction<any>,
	risk?: FieldPolicy<any> | FieldReadFunction<any>,
	cve?: FieldPolicy<any> | FieldReadFunction<any>,
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CVEKeySpecifier = ('name' | 'cvss' | 'cvssRank' | 'status' | 'poc' | 'patch' | 'exp' | 'description' | 'cvss3Info' | 'cvss2Info' | 'file' | CVEKeySpecifier)[];
export type CVEFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	cvss?: FieldPolicy<any> | FieldReadFunction<any>,
	cvssRank?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	poc?: FieldPolicy<any> | FieldReadFunction<any>,
	patch?: FieldPolicy<any> | FieldReadFunction<any>,
	exp?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	cvss3Info?: FieldPolicy<any> | FieldReadFunction<any>,
	cvss2Info?: FieldPolicy<any> | FieldReadFunction<any>,
	file?: FieldPolicy<any> | FieldReadFunction<any>
};
export type Cvss3InfoKeySpecifier = ('cvss' | 'attackVector' | 'attackComplexity' | 'privilegesRequired' | 'userInteraction' | 'scope' | 'confidentialityImpact' | 'integrityImpact' | 'availabilityImpact' | Cvss3InfoKeySpecifier)[];
export type Cvss3InfoFieldPolicy = {
	cvss?: FieldPolicy<any> | FieldReadFunction<any>,
	attackVector?: FieldPolicy<any> | FieldReadFunction<any>,
	attackComplexity?: FieldPolicy<any> | FieldReadFunction<any>,
	privilegesRequired?: FieldPolicy<any> | FieldReadFunction<any>,
	userInteraction?: FieldPolicy<any> | FieldReadFunction<any>,
	scope?: FieldPolicy<any> | FieldReadFunction<any>,
	confidentialityImpact?: FieldPolicy<any> | FieldReadFunction<any>,
	integrityImpact?: FieldPolicy<any> | FieldReadFunction<any>,
	availabilityImpact?: FieldPolicy<any> | FieldReadFunction<any>
};
export type Cvss2InfoKeySpecifier = ('cvss' | 'accessVector' | 'accessComplexity' | 'authentication' | 'confidentialityImpact' | 'integrityImpact' | 'availabilityImpact' | Cvss2InfoKeySpecifier)[];
export type Cvss2InfoFieldPolicy = {
	cvss?: FieldPolicy<any> | FieldReadFunction<any>,
	accessVector?: FieldPolicy<any> | FieldReadFunction<any>,
	accessComplexity?: FieldPolicy<any> | FieldReadFunction<any>,
	authentication?: FieldPolicy<any> | FieldReadFunction<any>,
	confidentialityImpact?: FieldPolicy<any> | FieldReadFunction<any>,
	integrityImpact?: FieldPolicy<any> | FieldReadFunction<any>,
	availabilityImpact?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckSecConnectionKeySpecifier = ('nodes' | 'fieldValues' | 'totalCount' | CheckSecConnectionKeySpecifier)[];
export type CheckSecConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	fieldValues?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckSecKeySpecifier = ('name' | 'canary' | 'fortified' | 'fortifyAble' | 'fortifySource' | 'nx' | 'pie' | 'relro' | 'rpath' | 'runpath' | 'symbols' | 'errDescription' | CheckSecKeySpecifier)[];
export type CheckSecFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	canary?: FieldPolicy<any> | FieldReadFunction<any>,
	fortified?: FieldPolicy<any> | FieldReadFunction<any>,
	fortifyAble?: FieldPolicy<any> | FieldReadFunction<any>,
	fortifySource?: FieldPolicy<any> | FieldReadFunction<any>,
	nx?: FieldPolicy<any> | FieldReadFunction<any>,
	pie?: FieldPolicy<any> | FieldReadFunction<any>,
	relro?: FieldPolicy<any> | FieldReadFunction<any>,
	rpath?: FieldPolicy<any> | FieldReadFunction<any>,
	runpath?: FieldPolicy<any> | FieldReadFunction<any>,
	symbols?: FieldPolicy<any> | FieldReadFunction<any>,
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CommandConnectionKeySpecifier = ('nodes' | 'totalCount' | CommandConnectionKeySpecifier)[];
export type CommandConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CommandKeySpecifier = ('id' | 'command' | 'result' | 'returnStatus' | 'errDescription' | CommandKeySpecifier)[];
export type CommandFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	command?: FieldPolicy<any> | FieldReadFunction<any>,
	result?: FieldPolicy<any> | FieldReadFunction<any>,
	returnStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type USBConnectionKeySpecifier = ('nodes' | 'totalCount' | USBConnectionKeySpecifier)[];
export type USBConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type USBKeySpecifier = ('busID' | 'deviceID' | 'idVendor' | 'idProduct' | 'description' | 'errDescription' | USBKeySpecifier)[];
export type USBFieldPolicy = {
	busID?: FieldPolicy<any> | FieldReadFunction<any>,
	deviceID?: FieldPolicy<any> | FieldReadFunction<any>,
	idVendor?: FieldPolicy<any> | FieldReadFunction<any>,
	idProduct?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ThreatAlertConnectionKeySpecifier = ('nodes' | 'totalCount' | ThreatAlertConnectionKeySpecifier)[];
export type ThreatAlertConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ThreatAlertKeySpecifier = ('interface' | 'procSecurity' | 'kernel' | 'score' | ThreatAlertKeySpecifier)[];
export type ThreatAlertFieldPolicy = {
	interface?: FieldPolicy<any> | FieldReadFunction<any>,
	procSecurity?: FieldPolicy<any> | FieldReadFunction<any>,
	kernel?: FieldPolicy<any> | FieldReadFunction<any>,
	score?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InterfaceSecurityKeySpecifier = ('name' | 'ip' | 'port' | 'inode' | InterfaceSecurityKeySpecifier)[];
export type InterfaceSecurityFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	ip?: FieldPolicy<any> | FieldReadFunction<any>,
	port?: FieldPolicy<any> | FieldReadFunction<any>,
	inode?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProcSecurityKeySpecifier = ('name' | 'pid' | 'attackVector' | 'security' | 'importance' | 'connectRelation' | 'score' | 'detailPosition' | 'baselinePosition' | ProcSecurityKeySpecifier)[];
export type ProcSecurityFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	pid?: FieldPolicy<any> | FieldReadFunction<any>,
	attackVector?: FieldPolicy<any> | FieldReadFunction<any>,
	security?: FieldPolicy<any> | FieldReadFunction<any>,
	importance?: FieldPolicy<any> | FieldReadFunction<any>,
	connectRelation?: FieldPolicy<any> | FieldReadFunction<any>,
	score?: FieldPolicy<any> | FieldReadFunction<any>,
	detailPosition?: FieldPolicy<any> | FieldReadFunction<any>,
	baselinePosition?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ConnectRelationKeySpecifier = ('type' | 'port' | 'detailPosition' | 'SignatureTag' | ConnectRelationKeySpecifier)[];
export type ConnectRelationFieldPolicy = {
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	port?: FieldPolicy<any> | FieldReadFunction<any>,
	detailPosition?: FieldPolicy<any> | FieldReadFunction<any>,
	SignatureTag?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PositionKeySpecifier = ('url' | 'offset' | PositionKeySpecifier)[];
export type PositionFieldPolicy = {
	url?: FieldPolicy<any> | FieldReadFunction<any>,
	offset?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckListKeySpecifier = ('key' | 'class' | 'list' | CheckListKeySpecifier)[];
export type CheckListFieldPolicy = {
	key?: FieldPolicy<any> | FieldReadFunction<any>,
	class?: FieldPolicy<any> | FieldReadFunction<any>,
	list?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckTypeKeySpecifier = ('key' | 'value' | CheckTypeKeySpecifier)[];
export type CheckTypeFieldPolicy = {
	key?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckKeySpecifier = ('rule' | 'risk' | CheckKeySpecifier)[];
export type CheckFieldPolicy = {
	rule?: FieldPolicy<any> | FieldReadFunction<any>,
	risk?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RuleKeySpecifier = ('id' | 'class' | 'classKey' | 'catalog' | 'catalogKey' | 'riskLevel' | 'ruleName' | 'riskContent' | 'riskReason' | 'description' | 'remediation' | 'time' | 'extra' | 'wp29' | 'detail' | RuleKeySpecifier)[];
export type RuleFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	class?: FieldPolicy<any> | FieldReadFunction<any>,
	classKey?: FieldPolicy<any> | FieldReadFunction<any>,
	catalog?: FieldPolicy<any> | FieldReadFunction<any>,
	catalogKey?: FieldPolicy<any> | FieldReadFunction<any>,
	riskLevel?: FieldPolicy<any> | FieldReadFunction<any>,
	ruleName?: FieldPolicy<any> | FieldReadFunction<any>,
	riskContent?: FieldPolicy<any> | FieldReadFunction<any>,
	riskReason?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	remediation?: FieldPolicy<any> | FieldReadFunction<any>,
	time?: FieldPolicy<any> | FieldReadFunction<any>,
	extra?: FieldPolicy<any> | FieldReadFunction<any>,
	wp29?: FieldPolicy<any> | FieldReadFunction<any>,
	detail?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WP29KeySpecifier = ('rule' | 'class' | 'detail' | 'example' | WP29KeySpecifier)[];
export type WP29FieldPolicy = {
	rule?: FieldPolicy<any> | FieldReadFunction<any>,
	class?: FieldPolicy<any> | FieldReadFunction<any>,
	detail?: FieldPolicy<any> | FieldReadFunction<any>,
	example?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DetailConnectionKeySpecifier = ('column' | 'nodes' | 'totalCount' | DetailConnectionKeySpecifier)[];
export type DetailConnectionFieldPolicy = {
	column?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ColumnKeySpecifier = ('key' | 'title' | 'type' | 'append' | ColumnKeySpecifier)[];
export type ColumnFieldPolicy = {
	key?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	append?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ColumnAppendKeySpecifier = ('key' | 'type' | ColumnAppendKeySpecifier)[];
export type ColumnAppendFieldPolicy = {
	key?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RuleConnectionKeySpecifier = ('nodes' | 'fieldValues' | 'totalCount' | RuleConnectionKeySpecifier)[];
export type RuleConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	fieldValues?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SensitiveInfoConnectionKeySpecifier = ('nodes' | 'fieldValues' | 'fieldValuesWithCount' | 'totalCount' | SensitiveInfoConnectionKeySpecifier)[];
export type SensitiveInfoConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	fieldValues?: FieldPolicy<any> | FieldReadFunction<any>,
	fieldValuesWithCount?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SensitiveContentKeySpecifier = ('file' | 'content' | SensitiveContentKeySpecifier)[];
export type SensitiveContentFieldPolicy = {
	file?: FieldPolicy<any> | FieldReadFunction<any>,
	content?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SensitiveFileKeySpecifier = ('name' | 'type' | SensitiveFileKeySpecifier)[];
export type SensitiveFileFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SensitiveIPKeySpecifier = ('ip' | 'type' | 'count' | 'files' | SensitiveIPKeySpecifier)[];
export type SensitiveIPFieldPolicy = {
	ip?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	files?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SensitiveDomainKeySpecifier = ('type' | 'domain' | 'count' | 'detail' | SensitiveDomainKeySpecifier)[];
export type SensitiveDomainFieldPolicy = {
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	domain?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	detail?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SensitiveDomainDetailKeySpecifier = ('content' | 'count' | 'files' | SensitiveDomainDetailKeySpecifier)[];
export type SensitiveDomainDetailFieldPolicy = {
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	files?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LicenseConnectionKeySpecifier = ('nodes' | 'fieldValues' | 'fieldValuesWithCount' | 'totalCount' | LicenseConnectionKeySpecifier)[];
export type LicenseConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	fieldValues?: FieldPolicy<any> | FieldReadFunction<any>,
	fieldValuesWithCount?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LicenseKeySpecifier = ('component' | 'description' | 'license' | 'file' | LicenseKeySpecifier)[];
export type LicenseFieldPolicy = {
	component?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	license?: FieldPolicy<any> | FieldReadFunction<any>,
	file?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LicenseDetailKeySpecifier = ('name' | 'source' | 'content' | 'risk' | 'required' | 'forbidden' | 'permitted' | LicenseDetailKeySpecifier)[];
export type LicenseDetailFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	source?: FieldPolicy<any> | FieldReadFunction<any>,
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	risk?: FieldPolicy<any> | FieldReadFunction<any>,
	required?: FieldPolicy<any> | FieldReadFunction<any>,
	forbidden?: FieldPolicy<any> | FieldReadFunction<any>,
	permitted?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LicenseTagKeySpecifier = ('name' | 'type' | 'description' | LicenseTagKeySpecifier)[];
export type LicenseTagFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProcRiskKeySpecifier = ('procSec' | 'exposedService' | ProcRiskKeySpecifier)[];
export type ProcRiskFieldPolicy = {
	procSec?: FieldPolicy<any> | FieldReadFunction<any>,
	exposedService?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProcSecConnectionKeySpecifier = ('nodes' | 'fieldValues' | 'totalCount' | ProcSecConnectionKeySpecifier)[];
export type ProcSecConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	fieldValues?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProcSecKeySpecifier = ('pid' | 'processName' | 'cmd' | 'root' | 'checkSec' | 'cveSec' | 'effectiveUID' | 'risk' | ProcSecKeySpecifier)[];
export type ProcSecFieldPolicy = {
	pid?: FieldPolicy<any> | FieldReadFunction<any>,
	processName?: FieldPolicy<any> | FieldReadFunction<any>,
	cmd?: FieldPolicy<any> | FieldReadFunction<any>,
	root?: FieldPolicy<any> | FieldReadFunction<any>,
	checkSec?: FieldPolicy<any> | FieldReadFunction<any>,
	cveSec?: FieldPolicy<any> | FieldReadFunction<any>,
	effectiveUID?: FieldPolicy<any> | FieldReadFunction<any>,
	risk?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExposedServiceConnectionKeySpecifier = ('nodes' | 'totalCount' | ExposedServiceConnectionKeySpecifier)[];
export type ExposedServiceConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExposedServiceKeySpecifier = ('pid' | 'processName' | 'localAddress' | 'localPort' | 'remoteAddress' | 'remotePort' | 'type' | 'effectiveUID' | ExposedServiceKeySpecifier)[];
export type ExposedServiceFieldPolicy = {
	pid?: FieldPolicy<any> | FieldReadFunction<any>,
	processName?: FieldPolicy<any> | FieldReadFunction<any>,
	localAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	localPort?: FieldPolicy<any> | FieldReadFunction<any>,
	remoteAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	remotePort?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	effectiveUID?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AndroidRiskKeySpecifier = ('selinux' | AndroidRiskKeySpecifier)[];
export type AndroidRiskFieldPolicy = {
	selinux?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SELinuxRiskConnectionKeySpecifier = ('nodes' | 'totalCount' | SELinuxRiskConnectionKeySpecifier)[];
export type SELinuxRiskConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SELinuxRiskKeySpecifier = ('revise' | 'action' | 'role' | 'context' | 'class' | 'detail' | SELinuxRiskKeySpecifier)[];
export type SELinuxRiskFieldPolicy = {
	revise?: FieldPolicy<any> | FieldReadFunction<any>,
	action?: FieldPolicy<any> | FieldReadFunction<any>,
	role?: FieldPolicy<any> | FieldReadFunction<any>,
	context?: FieldPolicy<any> | FieldReadFunction<any>,
	class?: FieldPolicy<any> | FieldReadFunction<any>,
	detail?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ApkReportKeySpecifier = ('id' | 'overview' | 'manifest' | 'components' | 'signature' | 'permission' | 'sdk' | 'listAudit' | 'auditReport' | 'audit' | 'ruleByID' | 'sensitiveInfo' | 'file' | 'libCveSec' | 'license' | 'position' | ApkReportKeySpecifier)[];
export type ApkReportFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	overview?: FieldPolicy<any> | FieldReadFunction<any>,
	manifest?: FieldPolicy<any> | FieldReadFunction<any>,
	components?: FieldPolicy<any> | FieldReadFunction<any>,
	signature?: FieldPolicy<any> | FieldReadFunction<any>,
	permission?: FieldPolicy<any> | FieldReadFunction<any>,
	sdk?: FieldPolicy<any> | FieldReadFunction<any>,
	listAudit?: FieldPolicy<any> | FieldReadFunction<any>,
	auditReport?: FieldPolicy<any> | FieldReadFunction<any>,
	audit?: FieldPolicy<any> | FieldReadFunction<any>,
	ruleByID?: FieldPolicy<any> | FieldReadFunction<any>,
	sensitiveInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	file?: FieldPolicy<any> | FieldReadFunction<any>,
	libCveSec?: FieldPolicy<any> | FieldReadFunction<any>,
	license?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ApkManifestKeySpecifier = ('appName' | 'packageName' | 'version' | 'md5' | 'sharedUserID' | 'allowBackup' | 'debuggable' | 'errDescription' | 'beginTime' | ApkManifestKeySpecifier)[];
export type ApkManifestFieldPolicy = {
	appName?: FieldPolicy<any> | FieldReadFunction<any>,
	packageName?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	md5?: FieldPolicy<any> | FieldReadFunction<any>,
	sharedUserID?: FieldPolicy<any> | FieldReadFunction<any>,
	allowBackup?: FieldPolicy<any> | FieldReadFunction<any>,
	debuggable?: FieldPolicy<any> | FieldReadFunction<any>,
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	beginTime?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ApkComponentsKeySpecifier = ('activities' | 'services' | 'receivers' | 'providers' | 'errDescription' | ApkComponentsKeySpecifier)[];
export type ApkComponentsFieldPolicy = {
	activities?: FieldPolicy<any> | FieldReadFunction<any>,
	services?: FieldPolicy<any> | FieldReadFunction<any>,
	receivers?: FieldPolicy<any> | FieldReadFunction<any>,
	providers?: FieldPolicy<any> | FieldReadFunction<any>,
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ApkSignatureKeySpecifier = ('version' | 'subject' | 'algorithm' | 'oid' | 'from' | 'to' | 'errDescription' | ApkSignatureKeySpecifier)[];
export type ApkSignatureFieldPolicy = {
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	subject?: FieldPolicy<any> | FieldReadFunction<any>,
	algorithm?: FieldPolicy<any> | FieldReadFunction<any>,
	oid?: FieldPolicy<any> | FieldReadFunction<any>,
	from?: FieldPolicy<any> | FieldReadFunction<any>,
	to?: FieldPolicy<any> | FieldReadFunction<any>,
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ApkPermissionConnectionKeySpecifier = ('nodes' | 'totalCount' | ApkPermissionConnectionKeySpecifier)[];
export type ApkPermissionConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ApkPermissionKeySpecifier = ('name' | 'errDescription' | ApkPermissionKeySpecifier)[];
export type ApkPermissionFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	errDescription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SDKConnectionKeySpecifier = ('nodes' | 'totalCount' | SDKConnectionKeySpecifier)[];
export type SDKConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SdkKeySpecifier = ('name' | SdkKeySpecifier)[];
export type SdkFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UploadFileKeySpecifier = ('id' | 'name' | 'type' | 'analyzeParam' | 'time' | UploadFileKeySpecifier)[];
export type UploadFileFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	analyzeParam?: FieldPolicy<any> | FieldReadFunction<any>,
	time?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectorConnectionKeySpecifier = ('nodes' | 'totalCount' | CollectorConnectionKeySpecifier)[];
export type CollectorConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectorKeySpecifier = ('id' | 'name' | 'description' | 'status' | 'time' | 'config' | 'logSubID' | CollectorKeySpecifier)[];
export type CollectorFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	time?: FieldPolicy<any> | FieldReadFunction<any>,
	config?: FieldPolicy<any> | FieldReadFunction<any>,
	logSubID?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AnalysisSettingKeySpecifier = ('analyzeTimeout' | 'fileType' | 'fileSkiped' | AnalysisSettingKeySpecifier)[];
export type AnalysisSettingFieldPolicy = {
	analyzeTimeout?: FieldPolicy<any> | FieldReadFunction<any>,
	fileType?: FieldPolicy<any> | FieldReadFunction<any>,
	fileSkiped?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AgentKeySpecifier = ('id' | 'name' | 'token' | 'status' | 'error' | 'time' | 'displayID' | 'version' | AgentKeySpecifier)[];
export type AgentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	error?: FieldPolicy<any> | FieldReadFunction<any>,
	time?: FieldPolicy<any> | FieldReadFunction<any>,
	displayID?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AnalysisStatusStatisticsKeySpecifier = ('status' | 'count' | AnalysisStatusStatisticsKeySpecifier)[];
export type AnalysisStatusStatisticsFieldPolicy = {
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AnalysisConnectionKeySpecifier = ('nodes' | 'fieldValues' | 'totalCount' | AnalysisConnectionKeySpecifier)[];
export type AnalysisConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	fieldValues?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProjectCaseResultCountKeySpecifier = ('autoCaseCount' | 'semiAutomaticCaseCount' | 'manualCaseCount' | ProjectCaseResultCountKeySpecifier)[];
export type ProjectCaseResultCountFieldPolicy = {
	autoCaseCount?: FieldPolicy<any> | FieldReadFunction<any>,
	semiAutomaticCaseCount?: FieldPolicy<any> | FieldReadFunction<any>,
	manualCaseCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProjectCaseResultIgnoreCountKeySpecifier = ('ignoreCaseCount' | 'stepWords' | ProjectCaseResultIgnoreCountKeySpecifier)[];
export type ProjectCaseResultIgnoreCountFieldPolicy = {
	ignoreCaseCount?: FieldPolicy<any> | FieldReadFunction<any>,
	stepWords?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TeamConnectionKeySpecifier = ('nodes' | 'totalCount' | TeamConnectionKeySpecifier)[];
export type TeamConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ManagementKeySpecifier = ('hostname' | 'timesLimit' | 'systemStatus' | 'user' | 'team' | 'api' | 'project' | 'analysis' | 'license' | 'earliestLogDate' | 'log' | 'agent' | 'task' | 'systemSetting' | 'SAMLSetting' | ManagementKeySpecifier)[];
export type ManagementFieldPolicy = {
	hostname?: FieldPolicy<any> | FieldReadFunction<any>,
	timesLimit?: FieldPolicy<any> | FieldReadFunction<any>,
	systemStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	team?: FieldPolicy<any> | FieldReadFunction<any>,
	api?: FieldPolicy<any> | FieldReadFunction<any>,
	project?: FieldPolicy<any> | FieldReadFunction<any>,
	analysis?: FieldPolicy<any> | FieldReadFunction<any>,
	license?: FieldPolicy<any> | FieldReadFunction<any>,
	earliestLogDate?: FieldPolicy<any> | FieldReadFunction<any>,
	log?: FieldPolicy<any> | FieldReadFunction<any>,
	agent?: FieldPolicy<any> | FieldReadFunction<any>,
	task?: FieldPolicy<any> | FieldReadFunction<any>,
	systemSetting?: FieldPolicy<any> | FieldReadFunction<any>,
	SAMLSetting?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SystemStatusKeySpecifier = ('disk' | 'postgres' | SystemStatusKeySpecifier)[];
export type SystemStatusFieldPolicy = {
	disk?: FieldPolicy<any> | FieldReadFunction<any>,
	postgres?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DiskStatusKeySpecifier = ('totalSpace' | 'freeSpace' | 'occupiedSpace' | DiskStatusKeySpecifier)[];
export type DiskStatusFieldPolicy = {
	totalSpace?: FieldPolicy<any> | FieldReadFunction<any>,
	freeSpace?: FieldPolicy<any> | FieldReadFunction<any>,
	occupiedSpace?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PostgresStatusKeySpecifier = ('totalSessionCount' | 'activeSessionCount' | 'idleSessionCount' | PostgresStatusKeySpecifier)[];
export type PostgresStatusFieldPolicy = {
	totalSessionCount?: FieldPolicy<any> | FieldReadFunction<any>,
	activeSessionCount?: FieldPolicy<any> | FieldReadFunction<any>,
	idleSessionCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type APIConnectionKeySpecifier = ('nodes' | 'totalCount' | APIConnectionKeySpecifier)[];
export type APIConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type APIKeySpecifier = ('id' | 'name' | 'status' | APIKeySpecifier)[];
export type APIFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SystemLicenseKeySpecifier = ('name' | 'version' | 'expireTime' | 'customerCompany' | SystemLicenseKeySpecifier)[];
export type SystemLicenseFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	expireTime?: FieldPolicy<any> | FieldReadFunction<any>,
	customerCompany?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LogKeySpecifier = ('content' | 'type' | 'level' | LogKeySpecifier)[];
export type LogFieldPolicy = {
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	level?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AgentConnectionKeySpecifier = ('nodes' | 'totalCount' | AgentConnectionKeySpecifier)[];
export type AgentConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SystemSettingKeySpecifier = ('singleUpload' | 'maxSingleUpload' | 'analyzeTimeout' | 'sessionExpTime' | 'logLevel' | SystemSettingKeySpecifier)[];
export type SystemSettingFieldPolicy = {
	singleUpload?: FieldPolicy<any> | FieldReadFunction<any>,
	maxSingleUpload?: FieldPolicy<any> | FieldReadFunction<any>,
	analyzeTimeout?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionExpTime?: FieldPolicy<any> | FieldReadFunction<any>,
	logLevel?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SAMLSettingKeySpecifier = ('enabled' | 'autoCreateUser' | 'autoJoinTeam' | 'autoJoinTeamRole' | 'url' | 'metaData' | SAMLSettingKeySpecifier)[];
export type SAMLSettingFieldPolicy = {
	enabled?: FieldPolicy<any> | FieldReadFunction<any>,
	autoCreateUser?: FieldPolicy<any> | FieldReadFunction<any>,
	autoJoinTeam?: FieldPolicy<any> | FieldReadFunction<any>,
	autoJoinTeamRole?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>,
	metaData?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PickUserConnectionKeySpecifier = ('nodes' | 'totalCount' | PickUserConnectionKeySpecifier)[];
export type PickUserConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PickUserKeySpecifier = ('id' | 'username' | PickUserKeySpecifier)[];
export type PickUserFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	username?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TokenConnectionKeySpecifier = ('nodes' | 'totalCount' | TokenConnectionKeySpecifier)[];
export type TokenConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TokenKeySpecifier = ('id' | 'token' | 'createTime' | 'description' | TokenKeySpecifier)[];
export type TokenFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	createTime?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AnalyzeTaskKeySpecifier = ('id' | 'type' | 'analyzerType' | 'command' | 'configFile' | 'logFile' | AnalyzeTaskKeySpecifier)[];
export type AnalyzeTaskFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	analyzerType?: FieldPolicy<any> | FieldReadFunction<any>,
	command?: FieldPolicy<any> | FieldReadFunction<any>,
	configFile?: FieldPolicy<any> | FieldReadFunction<any>,
	logFile?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SysMessageRspKeySpecifier = ('occTime' | 'message' | SysMessageRspKeySpecifier)[];
export type SysMessageRspFieldPolicy = {
	occTime?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MyItemsInterfaceRspKeySpecifier = ('teamId' | 'getCaseListByUserId' | 'getProjectListByUserId' | 'getToolListByUserId' | 'count' | MyItemsInterfaceRspKeySpecifier)[];
export type MyItemsInterfaceRspFieldPolicy = {
	teamId?: FieldPolicy<any> | FieldReadFunction<any>,
	getCaseListByUserId?: FieldPolicy<any> | FieldReadFunction<any>,
	getProjectListByUserId?: FieldPolicy<any> | FieldReadFunction<any>,
	getToolListByUserId?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CaseItemRspKeySpecifier = ('id' | 'caseName' | 'projectId' | 'projectName' | 'toolId' | 'toolName' | 'lawCatalogueId' | 'lawCatalogueName' | 'status' | 'handlerUser' | 'affiliationTitle' | CaseItemRspKeySpecifier)[];
export type CaseItemRspFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	caseName?: FieldPolicy<any> | FieldReadFunction<any>,
	projectId?: FieldPolicy<any> | FieldReadFunction<any>,
	projectName?: FieldPolicy<any> | FieldReadFunction<any>,
	toolId?: FieldPolicy<any> | FieldReadFunction<any>,
	toolName?: FieldPolicy<any> | FieldReadFunction<any>,
	lawCatalogueId?: FieldPolicy<any> | FieldReadFunction<any>,
	lawCatalogueName?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	handlerUser?: FieldPolicy<any> | FieldReadFunction<any>,
	affiliationTitle?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProjectInfoKeySpecifier = ('id' | 'name' | 'submitTime' | 'dutyUser' | 'dutyUserId' | 'taskStatus' | 'lawStandard' | 'carModel' | 'module' | 'version' | 'caseNumber' | 'autoSetpMaxIndex' | 'messages' | 'testObject' | 'testDeviceId' | 'testResult' | 'caseResultAlertNumber' | ProjectInfoKeySpecifier)[];
export type ProjectInfoFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	submitTime?: FieldPolicy<any> | FieldReadFunction<any>,
	dutyUser?: FieldPolicy<any> | FieldReadFunction<any>,
	dutyUserId?: FieldPolicy<any> | FieldReadFunction<any>,
	taskStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	lawStandard?: FieldPolicy<any> | FieldReadFunction<any>,
	carModel?: FieldPolicy<any> | FieldReadFunction<any>,
	module?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	caseNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	autoSetpMaxIndex?: FieldPolicy<any> | FieldReadFunction<any>,
	messages?: FieldPolicy<any> | FieldReadFunction<any>,
	testObject?: FieldPolicy<any> | FieldReadFunction<any>,
	testDeviceId?: FieldPolicy<any> | FieldReadFunction<any>,
	testResult?: FieldPolicy<any> | FieldReadFunction<any>,
	caseResultAlertNumber?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProjectTestObjectInfoKeySpecifier = ('autoPartsName' | 'systemName' | 'systemType' | 'systemVersion' | ProjectTestObjectInfoKeySpecifier)[];
export type ProjectTestObjectInfoFieldPolicy = {
	autoPartsName?: FieldPolicy<any> | FieldReadFunction<any>,
	systemName?: FieldPolicy<any> | FieldReadFunction<any>,
	systemType?: FieldPolicy<any> | FieldReadFunction<any>,
	systemVersion?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProjectTestResultRspKeySpecifier = ('passNumber' | 'unPassNumber' | 'unTestNumber' | 'ignoreNumber' | 'testingNumber' | 'caseNumber' | 'passRate' | ProjectTestResultRspKeySpecifier)[];
export type ProjectTestResultRspFieldPolicy = {
	passNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	unPassNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	unTestNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	ignoreNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	testingNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	caseNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	passRate?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ToolItemRspKeySpecifier = ('id' | 'name' | 'projectId' | 'projectName' | 'status' | 'dutyUser' | 'toolResult' | ToolItemRspKeySpecifier)[];
export type ToolItemRspFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	projectId?: FieldPolicy<any> | FieldReadFunction<any>,
	projectName?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	dutyUser?: FieldPolicy<any> | FieldReadFunction<any>,
	toolResult?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MyItemsCountKeySpecifier = ('caseCount' | 'projectCount' | 'toolCount' | MyItemsCountKeySpecifier)[];
export type MyItemsCountFieldPolicy = {
	caseCount?: FieldPolicy<any> | FieldReadFunction<any>,
	projectCount?: FieldPolicy<any> | FieldReadFunction<any>,
	toolCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TeamOverviewRspKeySpecifier = ('projectNumber' | 'passingRate' | 'passNumber' | 'unPassNumber' | 'checkingNumber' | 'unCheckedNumber' | 'carInfoList' | 'carInfoListClassify' | 'moduleInfoList' | TeamOverviewRspKeySpecifier)[];
export type TeamOverviewRspFieldPolicy = {
	projectNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	passingRate?: FieldPolicy<any> | FieldReadFunction<any>,
	passNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	unPassNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	checkingNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	unCheckedNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	carInfoList?: FieldPolicy<any> | FieldReadFunction<any>,
	carInfoListClassify?: FieldPolicy<any> | FieldReadFunction<any>,
	moduleInfoList?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CarInfoStatisFuseKeySpecifier = ('modelName' | 'value' | 'checkStatueMsg' | CarInfoStatisFuseKeySpecifier)[];
export type CarInfoStatisFuseFieldPolicy = {
	modelName?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>,
	checkStatueMsg?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CarInfoStatisKeySpecifier = ('modelName' | 'checkingNumber' | 'passNumber' | 'unPassNumber' | 'unCheckedNumber' | CarInfoStatisKeySpecifier)[];
export type CarInfoStatisFieldPolicy = {
	modelName?: FieldPolicy<any> | FieldReadFunction<any>,
	checkingNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	passNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	unPassNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	unCheckedNumber?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ModuleInfoStatisKeySpecifier = ('modelName' | 'number' | ModuleInfoStatisKeySpecifier)[];
export type ModuleInfoStatisFieldPolicy = {
	modelName?: FieldPolicy<any> | FieldReadFunction<any>,
	number?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RecentStatisticsRspKeySpecifier = ('statTime' | 'number' | RecentStatisticsRspKeySpecifier)[];
export type RecentStatisticsRspFieldPolicy = {
	statTime?: FieldPolicy<any> | FieldReadFunction<any>,
	number?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CaseOfToolResultRspKeySpecifier = ('toolItemBase' | 'caseResult' | CaseOfToolResultRspKeySpecifier)[];
export type CaseOfToolResultRspFieldPolicy = {
	toolItemBase?: FieldPolicy<any> | FieldReadFunction<any>,
	caseResult?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CaseResultKeySpecifier = ('id' | 'caseId' | 'serialNumber' | 'caseName' | 'status' | 'handlerUser' | 'catalogue' | 'lawCatalogueId' | 'territoryName' | 'territoryId' | 'classifyName' | 'classifyId' | 'operatingSystemName' | 'operatingSystemID' | 'operatingSystemType' | 'riskLevelName' | 'riskLevelType' | 'riskLevelId' | 'testMethodName' | 'testMethodId' | 'testMothodType' | CaseResultKeySpecifier)[];
export type CaseResultFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	caseId?: FieldPolicy<any> | FieldReadFunction<any>,
	serialNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	caseName?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	handlerUser?: FieldPolicy<any> | FieldReadFunction<any>,
	catalogue?: FieldPolicy<any> | FieldReadFunction<any>,
	lawCatalogueId?: FieldPolicy<any> | FieldReadFunction<any>,
	territoryName?: FieldPolicy<any> | FieldReadFunction<any>,
	territoryId?: FieldPolicy<any> | FieldReadFunction<any>,
	classifyName?: FieldPolicy<any> | FieldReadFunction<any>,
	classifyId?: FieldPolicy<any> | FieldReadFunction<any>,
	operatingSystemName?: FieldPolicy<any> | FieldReadFunction<any>,
	operatingSystemID?: FieldPolicy<any> | FieldReadFunction<any>,
	operatingSystemType?: FieldPolicy<any> | FieldReadFunction<any>,
	riskLevelName?: FieldPolicy<any> | FieldReadFunction<any>,
	riskLevelType?: FieldPolicy<any> | FieldReadFunction<any>,
	riskLevelId?: FieldPolicy<any> | FieldReadFunction<any>,
	testMethodName?: FieldPolicy<any> | FieldReadFunction<any>,
	testMethodId?: FieldPolicy<any> | FieldReadFunction<any>,
	testMothodType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CaseResultListRspKeySpecifier = ('count' | 'caseResultList' | CaseResultListRspKeySpecifier)[];
export type CaseResultListRspFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	caseResultList?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProjectTaskItemListKeySpecifier = ('carModelList' | 'principalList' | 'lawList' | 'modelList' | ProjectTaskItemListKeySpecifier)[];
export type ProjectTaskItemListFieldPolicy = {
	carModelList?: FieldPolicy<any> | FieldReadFunction<any>,
	principalList?: FieldPolicy<any> | FieldReadFunction<any>,
	lawList?: FieldPolicy<any> | FieldReadFunction<any>,
	modelList?: FieldPolicy<any> | FieldReadFunction<any>
};
export type NewTaskAttributeRspKeySpecifier = ('id' | 'name' | NewTaskAttributeRspKeySpecifier)[];
export type NewTaskAttributeRspFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MyProjectStatisticsRspKeySpecifier = ('projectNumber' | 'checkingNumber' | 'passNumber' | 'unPassNumber' | 'passingRate' | MyProjectStatisticsRspKeySpecifier)[];
export type MyProjectStatisticsRspFieldPolicy = {
	projectNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	checkingNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	passNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	unPassNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	passingRate?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProjectInfoRspKeySpecifier = ('count' | 'projectInfo' | ProjectInfoRspKeySpecifier)[];
export type ProjectInfoRspFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	projectInfo?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProjectDetailsRspKeySpecifier = ('teamId' | 'projectId' | 'projectResult' | 'toolResult' | ProjectDetailsRspKeySpecifier)[];
export type ProjectDetailsRspFieldPolicy = {
	teamId?: FieldPolicy<any> | FieldReadFunction<any>,
	projectId?: FieldPolicy<any> | FieldReadFunction<any>,
	projectResult?: FieldPolicy<any> | FieldReadFunction<any>,
	toolResult?: FieldPolicy<any> | FieldReadFunction<any>
};
export type HistoryRepKeySpecifier = ('count' | 'history' | HistoryRepKeySpecifier)[];
export type HistoryRepFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	history?: FieldPolicy<any> | FieldReadFunction<any>
};
export type HistoryKeySpecifier = ('id' | 'changeTime' | 'changeUser' | 'changeObject' | 'changematter' | HistoryKeySpecifier)[];
export type HistoryFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	changeTime?: FieldPolicy<any> | FieldReadFunction<any>,
	changeUser?: FieldPolicy<any> | FieldReadFunction<any>,
	changeObject?: FieldPolicy<any> | FieldReadFunction<any>,
	changematter?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CaseDetailRspKeySpecifier = ('caseResultId' | 'caseId' | 'projectId' | 'projectName' | 'caseName' | 'caseCheckStatus' | 'dutyLawName' | 'dutyLawCatalogueName' | 'dutyLawClassify1' | 'dutyLawClassify2' | 'dutyLawClassify3' | 'dutyLawClassify4' | 'dutyLawClassify5' | 'checkMethod' | 'testCaseStep' | 'resultStandard' | 'resultSuccess' | 'resultFail' | CaseDetailRspKeySpecifier)[];
export type CaseDetailRspFieldPolicy = {
	caseResultId?: FieldPolicy<any> | FieldReadFunction<any>,
	caseId?: FieldPolicy<any> | FieldReadFunction<any>,
	projectId?: FieldPolicy<any> | FieldReadFunction<any>,
	projectName?: FieldPolicy<any> | FieldReadFunction<any>,
	caseName?: FieldPolicy<any> | FieldReadFunction<any>,
	caseCheckStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	dutyLawName?: FieldPolicy<any> | FieldReadFunction<any>,
	dutyLawCatalogueName?: FieldPolicy<any> | FieldReadFunction<any>,
	dutyLawClassify1?: FieldPolicy<any> | FieldReadFunction<any>,
	dutyLawClassify2?: FieldPolicy<any> | FieldReadFunction<any>,
	dutyLawClassify3?: FieldPolicy<any> | FieldReadFunction<any>,
	dutyLawClassify4?: FieldPolicy<any> | FieldReadFunction<any>,
	dutyLawClassify5?: FieldPolicy<any> | FieldReadFunction<any>,
	checkMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	testCaseStep?: FieldPolicy<any> | FieldReadFunction<any>,
	resultStandard?: FieldPolicy<any> | FieldReadFunction<any>,
	resultSuccess?: FieldPolicy<any> | FieldReadFunction<any>,
	resultFail?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CatalogueTestResultRspKeySpecifier = ('passNumber' | 'unPassNumber' | 'testingNumber' | 'unTestNumber' | 'ignoreNumber' | 'catalogueNumber' | 'passRate' | CatalogueTestResultRspKeySpecifier)[];
export type CatalogueTestResultRspFieldPolicy = {
	passNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	unPassNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	testingNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	unTestNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	ignoreNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	catalogueNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	passRate?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LawCatalogueCheckDetailRepKeySpecifier = ('lawName' | 'lawCatalogueId' | 'dutyLawCatalogueName' | 'description' | 'dutyLawClassify1' | 'dutyLawClassify2' | 'dutyLawClassify3' | 'dutyLawClassify4' | 'dutyLawClassify5' | 'checkResultCount' | 'checkPassResultCount' | 'checkUnPassNumberCount' | 'checkUnTestNumberCount' | 'checkTestingNumberCount' | 'checkIgnoreNumberCount' | 'passStatus' | 'caseClassifyResultRep' | LawCatalogueCheckDetailRepKeySpecifier)[];
export type LawCatalogueCheckDetailRepFieldPolicy = {
	lawName?: FieldPolicy<any> | FieldReadFunction<any>,
	lawCatalogueId?: FieldPolicy<any> | FieldReadFunction<any>,
	dutyLawCatalogueName?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	dutyLawClassify1?: FieldPolicy<any> | FieldReadFunction<any>,
	dutyLawClassify2?: FieldPolicy<any> | FieldReadFunction<any>,
	dutyLawClassify3?: FieldPolicy<any> | FieldReadFunction<any>,
	dutyLawClassify4?: FieldPolicy<any> | FieldReadFunction<any>,
	dutyLawClassify5?: FieldPolicy<any> | FieldReadFunction<any>,
	checkResultCount?: FieldPolicy<any> | FieldReadFunction<any>,
	checkPassResultCount?: FieldPolicy<any> | FieldReadFunction<any>,
	checkUnPassNumberCount?: FieldPolicy<any> | FieldReadFunction<any>,
	checkUnTestNumberCount?: FieldPolicy<any> | FieldReadFunction<any>,
	checkTestingNumberCount?: FieldPolicy<any> | FieldReadFunction<any>,
	checkIgnoreNumberCount?: FieldPolicy<any> | FieldReadFunction<any>,
	passStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	caseClassifyResultRep?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CaseClassifyResultRepKeySpecifier = ('caseId' | 'caseSerialNumber' | 'caseName' | 'taskStatus' | 'checkTool' | 'hanlder' | 'lawCatalogueId' | CaseClassifyResultRepKeySpecifier)[];
export type CaseClassifyResultRepFieldPolicy = {
	caseId?: FieldPolicy<any> | FieldReadFunction<any>,
	caseSerialNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	caseName?: FieldPolicy<any> | FieldReadFunction<any>,
	taskStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	checkTool?: FieldPolicy<any> | FieldReadFunction<any>,
	hanlder?: FieldPolicy<any> | FieldReadFunction<any>,
	lawCatalogueId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProjectTaskKeySpecifier = ('taskId' | 'timeoutSecond' | 'taskStatus' | 'configJson' | 'clientExeProgress' | 'userSelected' | 'isUserCustomCaseProject' | ProjectTaskKeySpecifier)[];
export type ProjectTaskFieldPolicy = {
	taskId?: FieldPolicy<any> | FieldReadFunction<any>,
	timeoutSecond?: FieldPolicy<any> | FieldReadFunction<any>,
	taskStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	configJson?: FieldPolicy<any> | FieldReadFunction<any>,
	clientExeProgress?: FieldPolicy<any> | FieldReadFunction<any>,
	userSelected?: FieldPolicy<any> | FieldReadFunction<any>,
	isUserCustomCaseProject?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ActionEventKeySpecifier = ('projectTask' | 'eventId' | 'eventType' | 'status' | 'timeoutSecond' | 'cancel' | 'stepResultId' | 'stepCommand' | 'stepInformation' | ActionEventKeySpecifier)[];
export type ActionEventFieldPolicy = {
	projectTask?: FieldPolicy<any> | FieldReadFunction<any>,
	eventId?: FieldPolicy<any> | FieldReadFunction<any>,
	eventType?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	timeoutSecond?: FieldPolicy<any> | FieldReadFunction<any>,
	cancel?: FieldPolicy<any> | FieldReadFunction<any>,
	stepResultId?: FieldPolicy<any> | FieldReadFunction<any>,
	stepCommand?: FieldPolicy<any> | FieldReadFunction<any>,
	stepInformation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DeviceRspKeySpecifier = ('deviceId' | 'time' | DeviceRspKeySpecifier)[];
export type DeviceRspFieldPolicy = {
	deviceId?: FieldPolicy<any> | FieldReadFunction<any>,
	time?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StepBaseV2KeySpecifier = ('stepName' | 'stepDesc' | 'stepType' | 'markdown' | 'config' | 'result' | 'caseEnable' | 'resetCheckEnable' | StepBaseV2KeySpecifier)[];
export type StepBaseV2FieldPolicy = {
	stepName?: FieldPolicy<any> | FieldReadFunction<any>,
	stepDesc?: FieldPolicy<any> | FieldReadFunction<any>,
	stepType?: FieldPolicy<any> | FieldReadFunction<any>,
	markdown?: FieldPolicy<any> | FieldReadFunction<any>,
	config?: FieldPolicy<any> | FieldReadFunction<any>,
	result?: FieldPolicy<any> | FieldReadFunction<any>,
	caseEnable?: FieldPolicy<any> | FieldReadFunction<any>,
	resetCheckEnable?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GetCaseAllStepRspKeySpecifier = ('stepInfoList' | 'caseId' | 'caseName' | 'caseStatus' | 'currentCaseStepIndex' | 'projectStatus' | GetCaseAllStepRspKeySpecifier)[];
export type GetCaseAllStepRspFieldPolicy = {
	stepInfoList?: FieldPolicy<any> | FieldReadFunction<any>,
	caseId?: FieldPolicy<any> | FieldReadFunction<any>,
	caseName?: FieldPolicy<any> | FieldReadFunction<any>,
	caseStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	currentCaseStepIndex?: FieldPolicy<any> | FieldReadFunction<any>,
	projectStatus?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StepInfoKeySpecifier = ('stepId' | 'stepName' | 'stepTestJson' | StepInfoKeySpecifier)[];
export type StepInfoFieldPolicy = {
	stepId?: FieldPolicy<any> | FieldReadFunction<any>,
	stepName?: FieldPolicy<any> | FieldReadFunction<any>,
	stepTestJson?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LawCatalogueBaseDetailKeySpecifier = ('lawName' | 'lawCatalogueId' | 'dutyLawCatalogueName' | 'dutyLawClassify1' | 'dutyLawClassify2' | 'dutyLawClassify3' | 'dutyLawClassify4' | 'dutyLawClassify5' | 'description' | LawCatalogueBaseDetailKeySpecifier)[];
export type LawCatalogueBaseDetailFieldPolicy = {
	lawName?: FieldPolicy<any> | FieldReadFunction<any>,
	lawCatalogueId?: FieldPolicy<any> | FieldReadFunction<any>,
	dutyLawCatalogueName?: FieldPolicy<any> | FieldReadFunction<any>,
	dutyLawClassify1?: FieldPolicy<any> | FieldReadFunction<any>,
	dutyLawClassify2?: FieldPolicy<any> | FieldReadFunction<any>,
	dutyLawClassify3?: FieldPolicy<any> | FieldReadFunction<any>,
	dutyLawClassify4?: FieldPolicy<any> | FieldReadFunction<any>,
	dutyLawClassify5?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StepResultKeySpecifier = ('clientStatus' | 'stepStatus' | 'result' | 'setpIndex' | StepResultKeySpecifier)[];
export type StepResultFieldPolicy = {
	clientStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	stepStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	result?: FieldPolicy<any> | FieldReadFunction<any>,
	setpIndex?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DetectionProgressKeySpecifier = ('maxIndex' | 'index' | 'alert' | 'alertMessage' | 'autoTaskExeMsg' | 'autoTaskExeStatus' | DetectionProgressKeySpecifier)[];
export type DetectionProgressFieldPolicy = {
	maxIndex?: FieldPolicy<any> | FieldReadFunction<any>,
	index?: FieldPolicy<any> | FieldReadFunction<any>,
	alert?: FieldPolicy<any> | FieldReadFunction<any>,
	alertMessage?: FieldPolicy<any> | FieldReadFunction<any>,
	autoTaskExeMsg?: FieldPolicy<any> | FieldReadFunction<any>,
	autoTaskExeStatus?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DetectionProgressV2KeySpecifier = ('title' | 'currentIndedx' | 'progressPercent' | 'isFinished' | 'stepConfig' | DetectionProgressV2KeySpecifier)[];
export type DetectionProgressV2FieldPolicy = {
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	currentIndedx?: FieldPolicy<any> | FieldReadFunction<any>,
	progressPercent?: FieldPolicy<any> | FieldReadFunction<any>,
	isFinished?: FieldPolicy<any> | FieldReadFunction<any>,
	stepConfig?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DetectionStepConfigKeySpecifier = ('title' | 'description' | 'alertType' | DetectionStepConfigKeySpecifier)[];
export type DetectionStepConfigFieldPolicy = {
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	alertType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ClientDeviceOnlineKeySpecifier = ('isOnline' | 'deviceType' | 'deviceId' | 'deviceName' | 'clientId' | 'offlineData' | ClientDeviceOnlineKeySpecifier)[];
export type ClientDeviceOnlineFieldPolicy = {
	isOnline?: FieldPolicy<any> | FieldReadFunction<any>,
	deviceType?: FieldPolicy<any> | FieldReadFunction<any>,
	deviceId?: FieldPolicy<any> | FieldReadFunction<any>,
	deviceName?: FieldPolicy<any> | FieldReadFunction<any>,
	clientId?: FieldPolicy<any> | FieldReadFunction<any>,
	offlineData?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LinuxDeviceConnectInfoKeySpecifier = ('clientId' | 'connectType' | 'connectIP' | 'connectPort' | 'connectUser' | 'connectPassword' | 'connectCertificateUrl' | 'hasConnectCertificateFile' | 'uploadFileServerUrl' | LinuxDeviceConnectInfoKeySpecifier)[];
export type LinuxDeviceConnectInfoFieldPolicy = {
	clientId?: FieldPolicy<any> | FieldReadFunction<any>,
	connectType?: FieldPolicy<any> | FieldReadFunction<any>,
	connectIP?: FieldPolicy<any> | FieldReadFunction<any>,
	connectPort?: FieldPolicy<any> | FieldReadFunction<any>,
	connectUser?: FieldPolicy<any> | FieldReadFunction<any>,
	connectPassword?: FieldPolicy<any> | FieldReadFunction<any>,
	connectCertificateUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	hasConnectCertificateFile?: FieldPolicy<any> | FieldReadFunction<any>,
	uploadFileServerUrl?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LawInfoKeySpecifier = ('title' | 'lawId' | 'count' | 'catalogueList' | LawInfoKeySpecifier)[];
export type LawInfoFieldPolicy = {
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	lawId?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	catalogueList?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CarInfoRepKeySpecifier = ('count' | 'carList' | CarInfoRepKeySpecifier)[];
export type CarInfoRepFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	carList?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CarInfoKeySpecifier = ('id' | 'modelName' | 'description' | 'collectorConfig' | 'terminalModelInfos' | 'collectorResultUrl' | 'collectStatus' | 'collectorProgress' | 'collectorProgressMax' | 'createUserName' | 'createTimeFormart' | CarInfoKeySpecifier)[];
export type CarInfoFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	modelName?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	collectorConfig?: FieldPolicy<any> | FieldReadFunction<any>,
	terminalModelInfos?: FieldPolicy<any> | FieldReadFunction<any>,
	collectorResultUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	collectStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	collectorProgress?: FieldPolicy<any> | FieldReadFunction<any>,
	collectorProgressMax?: FieldPolicy<any> | FieldReadFunction<any>,
	createUserName?: FieldPolicy<any> | FieldReadFunction<any>,
	createTimeFormart?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LawDeatilMdKeySpecifier = ('title' | 'markDown' | LawDeatilMdKeySpecifier)[];
export type LawDeatilMdFieldPolicy = {
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	markDown?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ApkSelectorInfoKeySpecifier = ('appName' | 'packageName' | ApkSelectorInfoKeySpecifier)[];
export type ApkSelectorInfoFieldPolicy = {
	appName?: FieldPolicy<any> | FieldReadFunction<any>,
	packageName?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SuiteCustomItemRepKeySpecifier = ('count' | 'resultList' | SuiteCustomItemRepKeySpecifier)[];
export type SuiteCustomItemRepFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	resultList?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SuiteCustomItemKeySpecifier = ('id' | 'name' | 'layType' | 'descriptionInfo' | 'canModify' | 'caseCount' | SuiteCustomItemKeySpecifier)[];
export type SuiteCustomItemFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	layType?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	canModify?: FieldPolicy<any> | FieldReadFunction<any>,
	caseCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CaseCustomItemRepKeySpecifier = ('count' | 'selectCaseId' | 'resultList' | 'groupResultList' | 'suiteName' | 'uploadFileUrl' | 'canModify' | CaseCustomItemRepKeySpecifier)[];
export type CaseCustomItemRepFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	selectCaseId?: FieldPolicy<any> | FieldReadFunction<any>,
	resultList?: FieldPolicy<any> | FieldReadFunction<any>,
	groupResultList?: FieldPolicy<any> | FieldReadFunction<any>,
	suiteName?: FieldPolicy<any> | FieldReadFunction<any>,
	uploadFileUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	canModify?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CaseCustomItemKeySpecifier = ('id' | 'serialNumber' | 'name' | 'caseDesc' | 'remediation' | 'submitUserName' | 'submitTime' | 'belongSuite' | 'descriptionInfo' | 'caseType' | 'scriptFileName' | 'scriptUrl' | 'canModify' | 'bindName' | 'bindId' | 'classifyName' | 'classifyId' | 'operatingSystemName' | 'operatingSystemID' | 'operatingSystemType' | 'riskLevelName' | 'riskLevelType' | 'riskLevelId' | 'testMethodName' | 'testMethodId' | 'testMothodType' | CaseCustomItemKeySpecifier)[];
export type CaseCustomItemFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	serialNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	caseDesc?: FieldPolicy<any> | FieldReadFunction<any>,
	remediation?: FieldPolicy<any> | FieldReadFunction<any>,
	submitUserName?: FieldPolicy<any> | FieldReadFunction<any>,
	submitTime?: FieldPolicy<any> | FieldReadFunction<any>,
	belongSuite?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	caseType?: FieldPolicy<any> | FieldReadFunction<any>,
	scriptFileName?: FieldPolicy<any> | FieldReadFunction<any>,
	scriptUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	canModify?: FieldPolicy<any> | FieldReadFunction<any>,
	bindName?: FieldPolicy<any> | FieldReadFunction<any>,
	bindId?: FieldPolicy<any> | FieldReadFunction<any>,
	classifyName?: FieldPolicy<any> | FieldReadFunction<any>,
	classifyId?: FieldPolicy<any> | FieldReadFunction<any>,
	operatingSystemName?: FieldPolicy<any> | FieldReadFunction<any>,
	operatingSystemID?: FieldPolicy<any> | FieldReadFunction<any>,
	operatingSystemType?: FieldPolicy<any> | FieldReadFunction<any>,
	riskLevelName?: FieldPolicy<any> | FieldReadFunction<any>,
	riskLevelType?: FieldPolicy<any> | FieldReadFunction<any>,
	riskLevelId?: FieldPolicy<any> | FieldReadFunction<any>,
	testMethodName?: FieldPolicy<any> | FieldReadFunction<any>,
	testMethodId?: FieldPolicy<any> | FieldReadFunction<any>,
	testMothodType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CaseCustomItemResultGroupKeySpecifier = ('name' | 'groupCheckedStatus' | 'resultList' | CaseCustomItemResultGroupKeySpecifier)[];
export type CaseCustomItemResultGroupFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	groupCheckedStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	resultList?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaticItemKeySpecifier = ('id' | 'name' | StaticItemKeySpecifier)[];
export type StaticItemFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReportViewActionRspKeySpecifier = ('count' | 'type' | 'toolType' | 'caseReportList' | ReportViewActionRspKeySpecifier)[];
export type ReportViewActionRspFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	toolType?: FieldPolicy<any> | FieldReadFunction<any>,
	caseReportList?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CaseReportKeySpecifier = ('sysAnalysisId' | 'appName' | 'sysAuditorReportList' | CaseReportKeySpecifier)[];
export type CaseReportFieldPolicy = {
	sysAnalysisId?: FieldPolicy<any> | FieldReadFunction<any>,
	appName?: FieldPolicy<any> | FieldReadFunction<any>,
	sysAuditorReportList?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SysAuditorReportKeySpecifier = ('analysisResultId' | 'ruleName' | 'riskLevel' | 'catalog' | 'description' | 'remediation' | 'riskContent' | 'riskReason' | SysAuditorReportKeySpecifier)[];
export type SysAuditorReportFieldPolicy = {
	analysisResultId?: FieldPolicy<any> | FieldReadFunction<any>,
	ruleName?: FieldPolicy<any> | FieldReadFunction<any>,
	riskLevel?: FieldPolicy<any> | FieldReadFunction<any>,
	catalog?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	remediation?: FieldPolicy<any> | FieldReadFunction<any>,
	riskContent?: FieldPolicy<any> | FieldReadFunction<any>,
	riskReason?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CaseCheckedItemKeySpecifier = ('territoryList' | 'bindList' | 'classifyList' | 'operatingSystem' | 'riskLevel' | 'carSpareParts' | 'testMethod' | CaseCheckedItemKeySpecifier)[];
export type CaseCheckedItemFieldPolicy = {
	territoryList?: FieldPolicy<any> | FieldReadFunction<any>,
	bindList?: FieldPolicy<any> | FieldReadFunction<any>,
	classifyList?: FieldPolicy<any> | FieldReadFunction<any>,
	operatingSystem?: FieldPolicy<any> | FieldReadFunction<any>,
	riskLevel?: FieldPolicy<any> | FieldReadFunction<any>,
	carSpareParts?: FieldPolicy<any> | FieldReadFunction<any>,
	testMethod?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CarModelListRspKeySpecifier = ('count' | 'carInfoList' | CarModelListRspKeySpecifier)[];
export type CarModelListRspFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	carInfoList?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CarModelItemKeySpecifier = ('id' | 'carName' | 'createTime' | 'createUser' | 'carInfoItem' | CarModelItemKeySpecifier)[];
export type CarModelItemFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	carName?: FieldPolicy<any> | FieldReadFunction<any>,
	createTime?: FieldPolicy<any> | FieldReadFunction<any>,
	createUser?: FieldPolicy<any> | FieldReadFunction<any>,
	carInfoItem?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CarInfoItemKeySpecifier = ('id' | 'modelName' | 'modelId' | 'modelTypeId' | 'modelType' | 'collectType' | 'version' | 'collectStatus' | 'collectorProgress' | 'collectorProgressMax' | 'collectorFailLog' | CarInfoItemKeySpecifier)[];
export type CarInfoItemFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	modelName?: FieldPolicy<any> | FieldReadFunction<any>,
	modelId?: FieldPolicy<any> | FieldReadFunction<any>,
	modelTypeId?: FieldPolicy<any> | FieldReadFunction<any>,
	modelType?: FieldPolicy<any> | FieldReadFunction<any>,
	collectType?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	collectStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	collectorProgress?: FieldPolicy<any> | FieldReadFunction<any>,
	collectorProgressMax?: FieldPolicy<any> | FieldReadFunction<any>,
	collectorFailLog?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CarInfoItemSelectorKeySpecifier = ('id' | 'modelName' | 'titile' | 'modelList' | CarInfoItemSelectorKeySpecifier)[];
export type CarInfoItemSelectorFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	modelName?: FieldPolicy<any> | FieldReadFunction<any>,
	titile?: FieldPolicy<any> | FieldReadFunction<any>,
	modelList?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CarModelItemSelectorKeySpecifier = ('modelId' | 'modelName' | 'titile' | 'versions' | CarModelItemSelectorKeySpecifier)[];
export type CarModelItemSelectorFieldPolicy = {
	modelId?: FieldPolicy<any> | FieldReadFunction<any>,
	modelName?: FieldPolicy<any> | FieldReadFunction<any>,
	titile?: FieldPolicy<any> | FieldReadFunction<any>,
	versions?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VersionSelectorKeySpecifier = ('id' | 'titile' | 'versionName' | VersionSelectorKeySpecifier)[];
export type VersionSelectorFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	titile?: FieldPolicy<any> | FieldReadFunction<any>,
	versionName?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CommonalityAutoTaskReportRepKeySpecifier = ('count' | 'reportSystemUser' | 'reportFile' | 'reportCVESec' | 'reportApkSignature' | 'reportApkManifest' | 'reportCheckSec' | 'apkComponents' | CommonalityAutoTaskReportRepKeySpecifier)[];
export type CommonalityAutoTaskReportRepFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	reportSystemUser?: FieldPolicy<any> | FieldReadFunction<any>,
	reportFile?: FieldPolicy<any> | FieldReadFunction<any>,
	reportCVESec?: FieldPolicy<any> | FieldReadFunction<any>,
	reportApkSignature?: FieldPolicy<any> | FieldReadFunction<any>,
	reportApkManifest?: FieldPolicy<any> | FieldReadFunction<any>,
	reportCheckSec?: FieldPolicy<any> | FieldReadFunction<any>,
	apkComponents?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReportSystemUserKeySpecifier = ('gid' | 'passwordHash' | 'shell' | 'uid' | 'userName' | ReportSystemUserKeySpecifier)[];
export type ReportSystemUserFieldPolicy = {
	gid?: FieldPolicy<any> | FieldReadFunction<any>,
	passwordHash?: FieldPolicy<any> | FieldReadFunction<any>,
	shell?: FieldPolicy<any> | FieldReadFunction<any>,
	uid?: FieldPolicy<any> | FieldReadFunction<any>,
	userName?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReportFileKeySpecifier = ('name' | 'perm' | 'type' | ReportFileKeySpecifier)[];
export type ReportFileFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	perm?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReportCVESecKeySpecifier = ('mainList' | 'component' | 'risk' | 'version' | 'cvss' | 'cvssRank' | 'name' | 'patch' | 'poc' | 'status' | 'exp' | ReportCVESecKeySpecifier)[];
export type ReportCVESecFieldPolicy = {
	mainList?: FieldPolicy<any> | FieldReadFunction<any>,
	component?: FieldPolicy<any> | FieldReadFunction<any>,
	risk?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	cvss?: FieldPolicy<any> | FieldReadFunction<any>,
	cvssRank?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	patch?: FieldPolicy<any> | FieldReadFunction<any>,
	poc?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	exp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReportCVESecRiskKeySpecifier = ('count' | 'risk' | ReportCVESecRiskKeySpecifier)[];
export type ReportCVESecRiskFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	risk?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReportApkSignatureKeySpecifier = ('appName' | 'algorithm' | 'from' | 'oid' | 'subject' | 'to' | 'version' | ReportApkSignatureKeySpecifier)[];
export type ReportApkSignatureFieldPolicy = {
	appName?: FieldPolicy<any> | FieldReadFunction<any>,
	algorithm?: FieldPolicy<any> | FieldReadFunction<any>,
	from?: FieldPolicy<any> | FieldReadFunction<any>,
	oid?: FieldPolicy<any> | FieldReadFunction<any>,
	subject?: FieldPolicy<any> | FieldReadFunction<any>,
	to?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReportApkManifestKeySpecifier = ('appName' | 'allowBackup' | 'debuggable' | ReportApkManifestKeySpecifier)[];
export type ReportApkManifestFieldPolicy = {
	appName?: FieldPolicy<any> | FieldReadFunction<any>,
	allowBackup?: FieldPolicy<any> | FieldReadFunction<any>,
	debuggable?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReportCheckSecKeySpecifier = ('canary' | 'name' | 'nx' | 'pie' | 'relro' | 'rpath' | 'runpath' | 'symbols' | ReportCheckSecKeySpecifier)[];
export type ReportCheckSecFieldPolicy = {
	canary?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	nx?: FieldPolicy<any> | FieldReadFunction<any>,
	pie?: FieldPolicy<any> | FieldReadFunction<any>,
	relro?: FieldPolicy<any> | FieldReadFunction<any>,
	rpath?: FieldPolicy<any> | FieldReadFunction<any>,
	runpath?: FieldPolicy<any> | FieldReadFunction<any>,
	symbols?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ComplianceApkComponentsKeySpecifier = ('appName' | 'activities' | 'providers' | 'receivers' | 'services' | ComplianceApkComponentsKeySpecifier)[];
export type ComplianceApkComponentsFieldPolicy = {
	appName?: FieldPolicy<any> | FieldReadFunction<any>,
	activities?: FieldPolicy<any> | FieldReadFunction<any>,
	providers?: FieldPolicy<any> | FieldReadFunction<any>,
	receivers?: FieldPolicy<any> | FieldReadFunction<any>,
	services?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ClientKeySpecifier = ('isConnected' | 'clientId' | 'clientVersion' | 'clientOs' | 'clientHostName' | 'clientIp' | 'clientExecutingProjectTaskId' | 'inUsedDeviceInfo' | 'usbDeviceCount' | 'onlineUsbDevice' | ClientKeySpecifier)[];
export type ClientFieldPolicy = {
	isConnected?: FieldPolicy<any> | FieldReadFunction<any>,
	clientId?: FieldPolicy<any> | FieldReadFunction<any>,
	clientVersion?: FieldPolicy<any> | FieldReadFunction<any>,
	clientOs?: FieldPolicy<any> | FieldReadFunction<any>,
	clientHostName?: FieldPolicy<any> | FieldReadFunction<any>,
	clientIp?: FieldPolicy<any> | FieldReadFunction<any>,
	clientExecutingProjectTaskId?: FieldPolicy<any> | FieldReadFunction<any>,
	inUsedDeviceInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	usbDeviceCount?: FieldPolicy<any> | FieldReadFunction<any>,
	onlineUsbDevice?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OnlineUsbDeviceKeySpecifier = ('uuid' | 'serialNum' | 'clientId' | 'dType' | 'usbName' | 'usbAlertMessage' | OnlineUsbDeviceKeySpecifier)[];
export type OnlineUsbDeviceFieldPolicy = {
	uuid?: FieldPolicy<any> | FieldReadFunction<any>,
	serialNum?: FieldPolicy<any> | FieldReadFunction<any>,
	clientId?: FieldPolicy<any> | FieldReadFunction<any>,
	dType?: FieldPolicy<any> | FieldReadFunction<any>,
	usbName?: FieldPolicy<any> | FieldReadFunction<any>,
	usbAlertMessage?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MyProjectStatisticsKeySpecifier = ('projectNumber' | 'projectCheckingNumber' | 'projectPassNumber' | 'projectUnPassNumber' | 'passingRateChecking' | 'passingRatePass' | 'passingRateUnPass' | MyProjectStatisticsKeySpecifier)[];
export type MyProjectStatisticsFieldPolicy = {
	projectNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	projectCheckingNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	projectPassNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	projectUnPassNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	passingRateChecking?: FieldPolicy<any> | FieldReadFunction<any>,
	passingRatePass?: FieldPolicy<any> | FieldReadFunction<any>,
	passingRateUnPass?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaticUserItemKeySpecifier = ('userId' | 'name' | StaticUserItemKeySpecifier)[];
export type StaticUserItemFieldPolicy = {
	userId?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ClientAlertMsgKeySpecifier = ('hasAlert' | 'alertType' | 'uuid' | 'newDeviceName' | 'oldDeviceName' | ClientAlertMsgKeySpecifier)[];
export type ClientAlertMsgFieldPolicy = {
	hasAlert?: FieldPolicy<any> | FieldReadFunction<any>,
	alertType?: FieldPolicy<any> | FieldReadFunction<any>,
	uuid?: FieldPolicy<any> | FieldReadFunction<any>,
	newDeviceName?: FieldPolicy<any> | FieldReadFunction<any>,
	oldDeviceName?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CaseInfoKeySpecifier = ('caseBaseInfo' | 'complianceRequire' | 'caseTestProcess' | CaseInfoKeySpecifier)[];
export type CaseInfoFieldPolicy = {
	caseBaseInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	complianceRequire?: FieldPolicy<any> | FieldReadFunction<any>,
	caseTestProcess?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProjectSelectorListKeySpecifier = ('testObject' | 'clientAndroid' | 'clientLinux' | 'uploadFileUrl' | ProjectSelectorListKeySpecifier)[];
export type ProjectSelectorListFieldPolicy = {
	testObject?: FieldPolicy<any> | FieldReadFunction<any>,
	clientAndroid?: FieldPolicy<any> | FieldReadFunction<any>,
	clientLinux?: FieldPolicy<any> | FieldReadFunction<any>,
	uploadFileUrl?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProjectTestObjectListKeySpecifier = ('autoPartsId' | 'autoPartsName' | 'systemChild' | ProjectTestObjectListKeySpecifier)[];
export type ProjectTestObjectListFieldPolicy = {
	autoPartsId?: FieldPolicy<any> | FieldReadFunction<any>,
	autoPartsName?: FieldPolicy<any> | FieldReadFunction<any>,
	systemChild?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProjectTestObjectSystemListKeySpecifier = ('systemId' | 'systemName' | 'systemType' | 'systemVersion' | ProjectTestObjectSystemListKeySpecifier)[];
export type ProjectTestObjectSystemListFieldPolicy = {
	systemId?: FieldPolicy<any> | FieldReadFunction<any>,
	systemName?: FieldPolicy<any> | FieldReadFunction<any>,
	systemType?: FieldPolicy<any> | FieldReadFunction<any>,
	systemVersion?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProjectClientListKeySpecifier = ('clientId' | 'clientName' | 'clientChild' | ProjectClientListKeySpecifier)[];
export type ProjectClientListFieldPolicy = {
	clientId?: FieldPolicy<any> | FieldReadFunction<any>,
	clientName?: FieldPolicy<any> | FieldReadFunction<any>,
	clientChild?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProjectClientDeviceListKeySpecifier = ('deviceId' | 'deviceName' | 'isUsable' | ProjectClientDeviceListKeySpecifier)[];
export type ProjectClientDeviceListFieldPolicy = {
	deviceId?: FieldPolicy<any> | FieldReadFunction<any>,
	deviceName?: FieldPolicy<any> | FieldReadFunction<any>,
	isUsable?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CaseTestProcessRecordRspKeySpecifier = ('caseStatus' | 'caseBaseInfo' | 'complianceRequire' | 'caseTestProcess' | CaseTestProcessRecordRspKeySpecifier)[];
export type CaseTestProcessRecordRspFieldPolicy = {
	caseStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	caseBaseInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	complianceRequire?: FieldPolicy<any> | FieldReadFunction<any>,
	caseTestProcess?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CaseTestProcessRspKeySpecifier = ('stepName' | 'done' | 'process' | 'result' | 'remark' | 'data' | CaseTestProcessRspKeySpecifier)[];
export type CaseTestProcessRspFieldPolicy = {
	stepName?: FieldPolicy<any> | FieldReadFunction<any>,
	done?: FieldPolicy<any> | FieldReadFunction<any>,
	process?: FieldPolicy<any> | FieldReadFunction<any>,
	result?: FieldPolicy<any> | FieldReadFunction<any>,
	remark?: FieldPolicy<any> | FieldReadFunction<any>,
	data?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UploadDataKeySpecifier = ('fileUUID' | 'fileName' | 'size' | 'fileUrl' | UploadDataKeySpecifier)[];
export type UploadDataFieldPolicy = {
	fileUUID?: FieldPolicy<any> | FieldReadFunction<any>,
	fileName?: FieldPolicy<any> | FieldReadFunction<any>,
	size?: FieldPolicy<any> | FieldReadFunction<any>,
	fileUrl?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ClientDeviceOnlineV2KeySpecifier = ('isOnline' | 'userCancel' | 'deviceType' | 'deviceId' | 'deviceName' | 'clientId' | 'offlineData' | ClientDeviceOnlineV2KeySpecifier)[];
export type ClientDeviceOnlineV2FieldPolicy = {
	isOnline?: FieldPolicy<any> | FieldReadFunction<any>,
	userCancel?: FieldPolicy<any> | FieldReadFunction<any>,
	deviceType?: FieldPolicy<any> | FieldReadFunction<any>,
	deviceId?: FieldPolicy<any> | FieldReadFunction<any>,
	deviceName?: FieldPolicy<any> | FieldReadFunction<any>,
	clientId?: FieldPolicy<any> | FieldReadFunction<any>,
	offlineData?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppSelectedListKeySpecifier = ('appInfo' | 'analysisStatus' | 'analysisErrorMsg' | 'appName' | 'packageName' | AppSelectedListKeySpecifier)[];
export type AppSelectedListFieldPolicy = {
	appInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	analysisStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	analysisErrorMsg?: FieldPolicy<any> | FieldReadFunction<any>,
	appName?: FieldPolicy<any> | FieldReadFunction<any>,
	packageName?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('loginByPassword' | 'logout' | 'editPassword' | 'management' | 'team' | 'teamProject' | 'token' | 'agent' | 'startProjectDetection' | 'updateCaseResult' | 'resetToolResult' | 'submitResult' | 'openInformation' | 'getAppPackageList' | 'openReport' | 'screenAndUpload' | 'saveAndExcuseScript' | 'openTool' | 'resetStepCheckedResult' | 'nextStepSubmitResult' | 'fileUpload' | 'resetProject' | 'stopProject' | 'changeCaseStatus' | 'createNewCarIInfo' | 'collectorCarInfo' | 'delCarInfo' | 'editCarInfo' | 'submitSelectorList' | 'submitSelectorListV2' | 'createUserCustomCase' | 'editUserCustomCase' | 'createUserCustomCaseSuite' | 'deleteUserCustomCaseSuite' | 'deleteUserCustomCase' | 'createUserCustomCaseItem' | 'addUserCustomCaseIntoSuite' | 'createCarModelInfo' | 'editCarModelInfo' | 'editUserCustomCaseIntoSuite' | 'submitClientDeviceChange' | 'nextStepSubmitResultV2' | 'deleteStepUploadData' | 'screenshot' | 'changeCaseHandler' | 'saveStepInfo' | 'saveStepDialogInfo' | 'scriptExe' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	loginByPassword?: FieldPolicy<any> | FieldReadFunction<any>,
	logout?: FieldPolicy<any> | FieldReadFunction<any>,
	editPassword?: FieldPolicy<any> | FieldReadFunction<any>,
	management?: FieldPolicy<any> | FieldReadFunction<any>,
	team?: FieldPolicy<any> | FieldReadFunction<any>,
	teamProject?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	agent?: FieldPolicy<any> | FieldReadFunction<any>,
	startProjectDetection?: FieldPolicy<any> | FieldReadFunction<any>,
	updateCaseResult?: FieldPolicy<any> | FieldReadFunction<any>,
	resetToolResult?: FieldPolicy<any> | FieldReadFunction<any>,
	submitResult?: FieldPolicy<any> | FieldReadFunction<any>,
	openInformation?: FieldPolicy<any> | FieldReadFunction<any>,
	getAppPackageList?: FieldPolicy<any> | FieldReadFunction<any>,
	openReport?: FieldPolicy<any> | FieldReadFunction<any>,
	screenAndUpload?: FieldPolicy<any> | FieldReadFunction<any>,
	saveAndExcuseScript?: FieldPolicy<any> | FieldReadFunction<any>,
	openTool?: FieldPolicy<any> | FieldReadFunction<any>,
	resetStepCheckedResult?: FieldPolicy<any> | FieldReadFunction<any>,
	nextStepSubmitResult?: FieldPolicy<any> | FieldReadFunction<any>,
	fileUpload?: FieldPolicy<any> | FieldReadFunction<any>,
	resetProject?: FieldPolicy<any> | FieldReadFunction<any>,
	stopProject?: FieldPolicy<any> | FieldReadFunction<any>,
	changeCaseStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	createNewCarIInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	collectorCarInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	delCarInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	editCarInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	submitSelectorList?: FieldPolicy<any> | FieldReadFunction<any>,
	submitSelectorListV2?: FieldPolicy<any> | FieldReadFunction<any>,
	createUserCustomCase?: FieldPolicy<any> | FieldReadFunction<any>,
	editUserCustomCase?: FieldPolicy<any> | FieldReadFunction<any>,
	createUserCustomCaseSuite?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteUserCustomCaseSuite?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteUserCustomCase?: FieldPolicy<any> | FieldReadFunction<any>,
	createUserCustomCaseItem?: FieldPolicy<any> | FieldReadFunction<any>,
	addUserCustomCaseIntoSuite?: FieldPolicy<any> | FieldReadFunction<any>,
	createCarModelInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	editCarModelInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	editUserCustomCaseIntoSuite?: FieldPolicy<any> | FieldReadFunction<any>,
	submitClientDeviceChange?: FieldPolicy<any> | FieldReadFunction<any>,
	nextStepSubmitResultV2?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteStepUploadData?: FieldPolicy<any> | FieldReadFunction<any>,
	screenshot?: FieldPolicy<any> | FieldReadFunction<any>,
	changeCaseHandler?: FieldPolicy<any> | FieldReadFunction<any>,
	saveStepInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	saveStepDialogInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	scriptExe?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LoginPayloadKeySpecifier = ('token' | LoginPayloadKeySpecifier)[];
export type LoginPayloadFieldPolicy = {
	token?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ManagementMutationKeySpecifier = ('createUser' | 'deleteUser' | 'editUser' | 'createTeam' | 'deleteTeam' | 'editTeam' | 'operateAPI' | 'permanentlyDeleteProject' | 'permanentlyDeleteAnalysis' | 'restoreProject' | 'restoreAnalysis' | 'setLogLevel' | 'createAgent' | 'deleteAgent' | 'editAgent' | 'settingMutation' | 'updateLicense' | ManagementMutationKeySpecifier)[];
export type ManagementMutationFieldPolicy = {
	createUser?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteUser?: FieldPolicy<any> | FieldReadFunction<any>,
	editUser?: FieldPolicy<any> | FieldReadFunction<any>,
	createTeam?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteTeam?: FieldPolicy<any> | FieldReadFunction<any>,
	editTeam?: FieldPolicy<any> | FieldReadFunction<any>,
	operateAPI?: FieldPolicy<any> | FieldReadFunction<any>,
	permanentlyDeleteProject?: FieldPolicy<any> | FieldReadFunction<any>,
	permanentlyDeleteAnalysis?: FieldPolicy<any> | FieldReadFunction<any>,
	restoreProject?: FieldPolicy<any> | FieldReadFunction<any>,
	restoreAnalysis?: FieldPolicy<any> | FieldReadFunction<any>,
	setLogLevel?: FieldPolicy<any> | FieldReadFunction<any>,
	createAgent?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteAgent?: FieldPolicy<any> | FieldReadFunction<any>,
	editAgent?: FieldPolicy<any> | FieldReadFunction<any>,
	settingMutation?: FieldPolicy<any> | FieldReadFunction<any>,
	updateLicense?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SettingMutationKeySpecifier = ('systemSetting' | 'SAMLSetting' | SettingMutationKeySpecifier)[];
export type SettingMutationFieldPolicy = {
	systemSetting?: FieldPolicy<any> | FieldReadFunction<any>,
	SAMLSetting?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TeamMutationKeySpecifier = ('addUser' | 'removeUser' | 'editUser' | TeamMutationKeySpecifier)[];
export type TeamMutationFieldPolicy = {
	addUser?: FieldPolicy<any> | FieldReadFunction<any>,
	removeUser?: FieldPolicy<any> | FieldReadFunction<any>,
	editUser?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TeamProjectMutationKeySpecifier = ('createProject' | 'deleteProject' | 'editProject' | 'analyzeProject' | 'createAnalysisFast' | 'createAnalysis' | 'deleteAnalysis' | 'editAnalysis' | 'editAnalysisSetting' | 'analyzeAnalysis' | 'stopAnalysis' | 'undoAudit' | 'addCollector' | 'deleteCollector' | 'configCollector' | 'collectCollector' | 'stopCollector' | 'editFile' | 'checkProjectName' | TeamProjectMutationKeySpecifier)[];
export type TeamProjectMutationFieldPolicy = {
	createProject?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteProject?: FieldPolicy<any> | FieldReadFunction<any>,
	editProject?: FieldPolicy<any> | FieldReadFunction<any>,
	analyzeProject?: FieldPolicy<any> | FieldReadFunction<any>,
	createAnalysisFast?: FieldPolicy<any> | FieldReadFunction<any>,
	createAnalysis?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteAnalysis?: FieldPolicy<any> | FieldReadFunction<any>,
	editAnalysis?: FieldPolicy<any> | FieldReadFunction<any>,
	editAnalysisSetting?: FieldPolicy<any> | FieldReadFunction<any>,
	analyzeAnalysis?: FieldPolicy<any> | FieldReadFunction<any>,
	stopAnalysis?: FieldPolicy<any> | FieldReadFunction<any>,
	undoAudit?: FieldPolicy<any> | FieldReadFunction<any>,
	addCollector?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteCollector?: FieldPolicy<any> | FieldReadFunction<any>,
	configCollector?: FieldPolicy<any> | FieldReadFunction<any>,
	collectCollector?: FieldPolicy<any> | FieldReadFunction<any>,
	stopCollector?: FieldPolicy<any> | FieldReadFunction<any>,
	editFile?: FieldPolicy<any> | FieldReadFunction<any>,
	checkProjectName?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TokenMutationKeySpecifier = ('createToken' | 'deleteToken' | 'editToken' | 'activateToken' | TokenMutationKeySpecifier)[];
export type TokenMutationFieldPolicy = {
	createToken?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteToken?: FieldPolicy<any> | FieldReadFunction<any>,
	editToken?: FieldPolicy<any> | FieldReadFunction<any>,
	activateToken?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AgentMutationKeySpecifier = ('initAgent' | 'updateAgent' | 'updateTask' | AgentMutationKeySpecifier)[];
export type AgentMutationFieldPolicy = {
	initAgent?: FieldPolicy<any> | FieldReadFunction<any>,
	updateAgent?: FieldPolicy<any> | FieldReadFunction<any>,
	updateTask?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ActionPushResultKeySpecifier = ('result' | ActionPushResultKeySpecifier)[];
export type ActionPushResultFieldPolicy = {
	result?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SubscriptionKeySpecifier = ('analysisStatus' | 'collectorStatus' | 'log' | SubscriptionKeySpecifier)[];
export type SubscriptionFieldPolicy = {
	analysisStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	collectorStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	log?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StreamKeySpecifier = ('content' | 'type' | StreamKeySpecifier)[];
export type StreamFieldPolicy = {
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageInfoKeySpecifier = ('hasPreviousPage' | 'startCursor' | 'endCursor' | 'hasNextPage' | PageInfoKeySpecifier)[];
export type PageInfoFieldPolicy = {
	hasPreviousPage?: FieldPolicy<any> | FieldReadFunction<any>,
	startCursor?: FieldPolicy<any> | FieldReadFunction<any>,
	endCursor?: FieldPolicy<any> | FieldReadFunction<any>,
	hasNextPage?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StepBaseKeySpecifier = ('markdown' | 'code' | 'config' | 'caseEnable' | 'resetCheckEnable' | StepBaseKeySpecifier)[];
export type StepBaseFieldPolicy = {
	markdown?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	config?: FieldPolicy<any> | FieldReadFunction<any>,
	caseEnable?: FieldPolicy<any> | FieldReadFunction<any>,
	resetCheckEnable?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TypedTypePolicies = TypePolicies & {
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	FeatureConfig?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FeatureConfigKeySpecifier | (() => undefined | FeatureConfigKeySpecifier),
		fields?: FeatureConfigFieldPolicy,
	},
	ReportFeatureConfig?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReportFeatureConfigKeySpecifier | (() => undefined | ReportFeatureConfigKeySpecifier),
		fields?: ReportFeatureConfigFieldPolicy,
	},
	Dependence?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DependenceKeySpecifier | (() => undefined | DependenceKeySpecifier),
		fields?: DependenceFieldPolicy,
	},
	User?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier),
		fields?: UserFieldPolicy,
	},
	Role?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RoleKeySpecifier | (() => undefined | RoleKeySpecifier),
		fields?: RoleFieldPolicy,
	},
	Overview?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OverviewKeySpecifier | (() => undefined | OverviewKeySpecifier),
		fields?: OverviewFieldPolicy,
	},
	CommonStatusStatistics?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CommonStatusStatisticsKeySpecifier | (() => undefined | CommonStatusStatisticsKeySpecifier),
		fields?: CommonStatusStatisticsFieldPolicy,
	},
	AllRiskStatistics?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AllRiskStatisticsKeySpecifier | (() => undefined | AllRiskStatisticsKeySpecifier),
		fields?: AllRiskStatisticsFieldPolicy,
	},
	CheckRiskStatistics?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckRiskStatisticsKeySpecifier | (() => undefined | CheckRiskStatisticsKeySpecifier),
		fields?: CheckRiskStatisticsFieldPolicy,
	},
	CvssRankStatistics?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CvssRankStatisticsKeySpecifier | (() => undefined | CvssRankStatisticsKeySpecifier),
		fields?: CvssRankStatisticsFieldPolicy,
	},
	LicenseRiskStatistics?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | LicenseRiskStatisticsKeySpecifier | (() => undefined | LicenseRiskStatisticsKeySpecifier),
		fields?: LicenseRiskStatisticsFieldPolicy,
	},
	TeamStatistics?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TeamStatisticsKeySpecifier | (() => undefined | TeamStatisticsKeySpecifier),
		fields?: TeamStatisticsFieldPolicy,
	},
	Limit?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | LimitKeySpecifier | (() => undefined | LimitKeySpecifier),
		fields?: LimitFieldPolicy,
	},
	Project?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProjectKeySpecifier | (() => undefined | ProjectKeySpecifier),
		fields?: ProjectFieldPolicy,
	},
	Node?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | NodeKeySpecifier | (() => undefined | NodeKeySpecifier),
		fields?: NodeFieldPolicy,
	},
	Team?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TeamKeySpecifier | (() => undefined | TeamKeySpecifier),
		fields?: TeamFieldPolicy,
	},
	TeamOverview?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TeamOverviewKeySpecifier | (() => undefined | TeamOverviewKeySpecifier),
		fields?: TeamOverviewFieldPolicy,
	},
	ProjectConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProjectConnectionKeySpecifier | (() => undefined | ProjectConnectionKeySpecifier),
		fields?: ProjectConnectionFieldPolicy,
	},
	TeamManager?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TeamManagerKeySpecifier | (() => undefined | TeamManagerKeySpecifier),
		fields?: TeamManagerFieldPolicy,
	},
	UserConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserConnectionKeySpecifier | (() => undefined | UserConnectionKeySpecifier),
		fields?: UserConnectionFieldPolicy,
	},
	TaskConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaskConnectionKeySpecifier | (() => undefined | TaskConnectionKeySpecifier),
		fields?: TaskConnectionFieldPolicy,
	},
	Task?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaskKeySpecifier | (() => undefined | TaskKeySpecifier),
		fields?: TaskFieldPolicy,
	},
	Analysis?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AnalysisKeySpecifier | (() => undefined | AnalysisKeySpecifier),
		fields?: AnalysisFieldPolicy,
	},
	SysReport?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SysReportKeySpecifier | (() => undefined | SysReportKeySpecifier),
		fields?: SysReportFieldPolicy,
	},
	ReportOverview?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReportOverviewKeySpecifier | (() => undefined | ReportOverviewKeySpecifier),
		fields?: ReportOverviewFieldPolicy,
	},
	CommonRiskStatistics?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CommonRiskStatisticsKeySpecifier | (() => undefined | CommonRiskStatisticsKeySpecifier),
		fields?: CommonRiskStatisticsFieldPolicy,
	},
	System?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SystemKeySpecifier | (() => undefined | SystemKeySpecifier),
		fields?: SystemFieldPolicy,
	},
	Kernel?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | KernelKeySpecifier | (() => undefined | KernelKeySpecifier),
		fields?: KernelFieldPolicy,
	},
	ErrDescription?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ErrDescriptionKeySpecifier | (() => undefined | ErrDescriptionKeySpecifier),
		fields?: ErrDescriptionFieldPolicy,
	},
	BuddyInfoConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BuddyInfoConnectionKeySpecifier | (() => undefined | BuddyInfoConnectionKeySpecifier),
		fields?: BuddyInfoConnectionFieldPolicy,
	},
	BuddyInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BuddyInfoKeySpecifier | (() => undefined | BuddyInfoKeySpecifier),
		fields?: BuddyInfoFieldPolicy,
	},
	CryptoConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CryptoConnectionKeySpecifier | (() => undefined | CryptoConnectionKeySpecifier),
		fields?: CryptoConnectionFieldPolicy,
	},
	Crypto?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CryptoKeySpecifier | (() => undefined | CryptoKeySpecifier),
		fields?: CryptoFieldPolicy,
	},
	SupportedfsConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SupportedfsConnectionKeySpecifier | (() => undefined | SupportedfsConnectionKeySpecifier),
		fields?: SupportedfsConnectionFieldPolicy,
	},
	Supportedfs?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SupportedfsKeySpecifier | (() => undefined | SupportedfsKeySpecifier),
		fields?: SupportedfsFieldPolicy,
	},
	HostConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | HostConnectionKeySpecifier | (() => undefined | HostConnectionKeySpecifier),
		fields?: HostConnectionFieldPolicy,
	},
	Host?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | HostKeySpecifier | (() => undefined | HostKeySpecifier),
		fields?: HostFieldPolicy,
	},
	SystemUserConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SystemUserConnectionKeySpecifier | (() => undefined | SystemUserConnectionKeySpecifier),
		fields?: SystemUserConnectionFieldPolicy,
	},
	SystemUser?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SystemUserKeySpecifier | (() => undefined | SystemUserKeySpecifier),
		fields?: SystemUserFieldPolicy,
	},
	GroupConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GroupConnectionKeySpecifier | (() => undefined | GroupConnectionKeySpecifier),
		fields?: GroupConnectionFieldPolicy,
	},
	Group?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GroupKeySpecifier | (() => undefined | GroupKeySpecifier),
		fields?: GroupFieldPolicy,
	},
	Network?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | NetworkKeySpecifier | (() => undefined | NetworkKeySpecifier),
		fields?: NetworkFieldPolicy,
	},
	InterfaceConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InterfaceConnectionKeySpecifier | (() => undefined | InterfaceConnectionKeySpecifier),
		fields?: InterfaceConnectionFieldPolicy,
	},
	Interface?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InterfaceKeySpecifier | (() => undefined | InterfaceKeySpecifier),
		fields?: InterfaceFieldPolicy,
	},
	RoutingConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RoutingConnectionKeySpecifier | (() => undefined | RoutingConnectionKeySpecifier),
		fields?: RoutingConnectionFieldPolicy,
	},
	Routing?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RoutingKeySpecifier | (() => undefined | RoutingKeySpecifier),
		fields?: RoutingFieldPolicy,
	},
	UnixSocketConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UnixSocketConnectionKeySpecifier | (() => undefined | UnixSocketConnectionKeySpecifier),
		fields?: UnixSocketConnectionFieldPolicy,
	},
	UnixSocket?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UnixSocketKeySpecifier | (() => undefined | UnixSocketKeySpecifier),
		fields?: UnixSocketFieldPolicy,
	},
	SocketConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SocketConnectionKeySpecifier | (() => undefined | SocketConnectionKeySpecifier),
		fields?: SocketConnectionFieldPolicy,
	},
	Socket?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SocketKeySpecifier | (() => undefined | SocketKeySpecifier),
		fields?: SocketFieldPolicy,
	},
	FileConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FileConnectionKeySpecifier | (() => undefined | FileConnectionKeySpecifier),
		fields?: FileConnectionFieldPolicy,
	},
	File?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FileKeySpecifier | (() => undefined | FileKeySpecifier),
		fields?: FileFieldPolicy,
	},
	StoragePartitionConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StoragePartitionConnectionKeySpecifier | (() => undefined | StoragePartitionConnectionKeySpecifier),
		fields?: StoragePartitionConnectionFieldPolicy,
	},
	StoragePartition?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StoragePartitionKeySpecifier | (() => undefined | StoragePartitionKeySpecifier),
		fields?: StoragePartitionFieldPolicy,
	},
	ProcessConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProcessConnectionKeySpecifier | (() => undefined | ProcessConnectionKeySpecifier),
		fields?: ProcessConnectionFieldPolicy,
	},
	Process?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProcessKeySpecifier | (() => undefined | ProcessKeySpecifier),
		fields?: ProcessFieldPolicy,
	},
	ProcessStatus?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProcessStatusKeySpecifier | (() => undefined | ProcessStatusKeySpecifier),
		fields?: ProcessStatusFieldPolicy,
	},
	Sharelib?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SharelibKeySpecifier | (() => undefined | SharelibKeySpecifier),
		fields?: SharelibFieldPolicy,
	},
	StorageUsageConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StorageUsageConnectionKeySpecifier | (() => undefined | StorageUsageConnectionKeySpecifier),
		fields?: StorageUsageConnectionFieldPolicy,
	},
	StorageUsage?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StorageUsageKeySpecifier | (() => undefined | StorageUsageKeySpecifier),
		fields?: StorageUsageFieldPolicy,
	},
	StorageMountConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StorageMountConnectionKeySpecifier | (() => undefined | StorageMountConnectionKeySpecifier),
		fields?: StorageMountConnectionFieldPolicy,
	},
	StorageMount?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StorageMountKeySpecifier | (() => undefined | StorageMountKeySpecifier),
		fields?: StorageMountFieldPolicy,
	},
	CVESecConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CVESecConnectionKeySpecifier | (() => undefined | CVESecConnectionKeySpecifier),
		fields?: CVESecConnectionFieldPolicy,
	},
	CVESec?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CVESecKeySpecifier | (() => undefined | CVESecKeySpecifier),
		fields?: CVESecFieldPolicy,
	},
	CVE?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CVEKeySpecifier | (() => undefined | CVEKeySpecifier),
		fields?: CVEFieldPolicy,
	},
	Cvss3Info?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | Cvss3InfoKeySpecifier | (() => undefined | Cvss3InfoKeySpecifier),
		fields?: Cvss3InfoFieldPolicy,
	},
	Cvss2Info?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | Cvss2InfoKeySpecifier | (() => undefined | Cvss2InfoKeySpecifier),
		fields?: Cvss2InfoFieldPolicy,
	},
	CheckSecConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckSecConnectionKeySpecifier | (() => undefined | CheckSecConnectionKeySpecifier),
		fields?: CheckSecConnectionFieldPolicy,
	},
	CheckSec?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckSecKeySpecifier | (() => undefined | CheckSecKeySpecifier),
		fields?: CheckSecFieldPolicy,
	},
	CommandConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CommandConnectionKeySpecifier | (() => undefined | CommandConnectionKeySpecifier),
		fields?: CommandConnectionFieldPolicy,
	},
	Command?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CommandKeySpecifier | (() => undefined | CommandKeySpecifier),
		fields?: CommandFieldPolicy,
	},
	USBConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | USBConnectionKeySpecifier | (() => undefined | USBConnectionKeySpecifier),
		fields?: USBConnectionFieldPolicy,
	},
	USB?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | USBKeySpecifier | (() => undefined | USBKeySpecifier),
		fields?: USBFieldPolicy,
	},
	ThreatAlertConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ThreatAlertConnectionKeySpecifier | (() => undefined | ThreatAlertConnectionKeySpecifier),
		fields?: ThreatAlertConnectionFieldPolicy,
	},
	ThreatAlert?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ThreatAlertKeySpecifier | (() => undefined | ThreatAlertKeySpecifier),
		fields?: ThreatAlertFieldPolicy,
	},
	InterfaceSecurity?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InterfaceSecurityKeySpecifier | (() => undefined | InterfaceSecurityKeySpecifier),
		fields?: InterfaceSecurityFieldPolicy,
	},
	ProcSecurity?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProcSecurityKeySpecifier | (() => undefined | ProcSecurityKeySpecifier),
		fields?: ProcSecurityFieldPolicy,
	},
	ConnectRelation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ConnectRelationKeySpecifier | (() => undefined | ConnectRelationKeySpecifier),
		fields?: ConnectRelationFieldPolicy,
	},
	Position?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PositionKeySpecifier | (() => undefined | PositionKeySpecifier),
		fields?: PositionFieldPolicy,
	},
	CheckList?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckListKeySpecifier | (() => undefined | CheckListKeySpecifier),
		fields?: CheckListFieldPolicy,
	},
	CheckType?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckTypeKeySpecifier | (() => undefined | CheckTypeKeySpecifier),
		fields?: CheckTypeFieldPolicy,
	},
	Check?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckKeySpecifier | (() => undefined | CheckKeySpecifier),
		fields?: CheckFieldPolicy,
	},
	Rule?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RuleKeySpecifier | (() => undefined | RuleKeySpecifier),
		fields?: RuleFieldPolicy,
	},
	WP29?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WP29KeySpecifier | (() => undefined | WP29KeySpecifier),
		fields?: WP29FieldPolicy,
	},
	DetailConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DetailConnectionKeySpecifier | (() => undefined | DetailConnectionKeySpecifier),
		fields?: DetailConnectionFieldPolicy,
	},
	Column?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ColumnKeySpecifier | (() => undefined | ColumnKeySpecifier),
		fields?: ColumnFieldPolicy,
	},
	ColumnAppend?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ColumnAppendKeySpecifier | (() => undefined | ColumnAppendKeySpecifier),
		fields?: ColumnAppendFieldPolicy,
	},
	RuleConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RuleConnectionKeySpecifier | (() => undefined | RuleConnectionKeySpecifier),
		fields?: RuleConnectionFieldPolicy,
	},
	SensitiveInfoConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SensitiveInfoConnectionKeySpecifier | (() => undefined | SensitiveInfoConnectionKeySpecifier),
		fields?: SensitiveInfoConnectionFieldPolicy,
	},
	SensitiveContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SensitiveContentKeySpecifier | (() => undefined | SensitiveContentKeySpecifier),
		fields?: SensitiveContentFieldPolicy,
	},
	SensitiveFile?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SensitiveFileKeySpecifier | (() => undefined | SensitiveFileKeySpecifier),
		fields?: SensitiveFileFieldPolicy,
	},
	SensitiveIP?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SensitiveIPKeySpecifier | (() => undefined | SensitiveIPKeySpecifier),
		fields?: SensitiveIPFieldPolicy,
	},
	SensitiveDomain?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SensitiveDomainKeySpecifier | (() => undefined | SensitiveDomainKeySpecifier),
		fields?: SensitiveDomainFieldPolicy,
	},
	SensitiveDomainDetail?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SensitiveDomainDetailKeySpecifier | (() => undefined | SensitiveDomainDetailKeySpecifier),
		fields?: SensitiveDomainDetailFieldPolicy,
	},
	LicenseConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | LicenseConnectionKeySpecifier | (() => undefined | LicenseConnectionKeySpecifier),
		fields?: LicenseConnectionFieldPolicy,
	},
	License?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | LicenseKeySpecifier | (() => undefined | LicenseKeySpecifier),
		fields?: LicenseFieldPolicy,
	},
	LicenseDetail?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | LicenseDetailKeySpecifier | (() => undefined | LicenseDetailKeySpecifier),
		fields?: LicenseDetailFieldPolicy,
	},
	LicenseTag?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | LicenseTagKeySpecifier | (() => undefined | LicenseTagKeySpecifier),
		fields?: LicenseTagFieldPolicy,
	},
	ProcRisk?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProcRiskKeySpecifier | (() => undefined | ProcRiskKeySpecifier),
		fields?: ProcRiskFieldPolicy,
	},
	ProcSecConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProcSecConnectionKeySpecifier | (() => undefined | ProcSecConnectionKeySpecifier),
		fields?: ProcSecConnectionFieldPolicy,
	},
	ProcSec?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProcSecKeySpecifier | (() => undefined | ProcSecKeySpecifier),
		fields?: ProcSecFieldPolicy,
	},
	ExposedServiceConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExposedServiceConnectionKeySpecifier | (() => undefined | ExposedServiceConnectionKeySpecifier),
		fields?: ExposedServiceConnectionFieldPolicy,
	},
	ExposedService?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExposedServiceKeySpecifier | (() => undefined | ExposedServiceKeySpecifier),
		fields?: ExposedServiceFieldPolicy,
	},
	AndroidRisk?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AndroidRiskKeySpecifier | (() => undefined | AndroidRiskKeySpecifier),
		fields?: AndroidRiskFieldPolicy,
	},
	SELinuxRiskConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SELinuxRiskConnectionKeySpecifier | (() => undefined | SELinuxRiskConnectionKeySpecifier),
		fields?: SELinuxRiskConnectionFieldPolicy,
	},
	SELinuxRisk?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SELinuxRiskKeySpecifier | (() => undefined | SELinuxRiskKeySpecifier),
		fields?: SELinuxRiskFieldPolicy,
	},
	ApkReport?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ApkReportKeySpecifier | (() => undefined | ApkReportKeySpecifier),
		fields?: ApkReportFieldPolicy,
	},
	ApkManifest?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ApkManifestKeySpecifier | (() => undefined | ApkManifestKeySpecifier),
		fields?: ApkManifestFieldPolicy,
	},
	ApkComponents?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ApkComponentsKeySpecifier | (() => undefined | ApkComponentsKeySpecifier),
		fields?: ApkComponentsFieldPolicy,
	},
	ApkSignature?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ApkSignatureKeySpecifier | (() => undefined | ApkSignatureKeySpecifier),
		fields?: ApkSignatureFieldPolicy,
	},
	ApkPermissionConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ApkPermissionConnectionKeySpecifier | (() => undefined | ApkPermissionConnectionKeySpecifier),
		fields?: ApkPermissionConnectionFieldPolicy,
	},
	ApkPermission?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ApkPermissionKeySpecifier | (() => undefined | ApkPermissionKeySpecifier),
		fields?: ApkPermissionFieldPolicy,
	},
	SDKConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SDKConnectionKeySpecifier | (() => undefined | SDKConnectionKeySpecifier),
		fields?: SDKConnectionFieldPolicy,
	},
	Sdk?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SdkKeySpecifier | (() => undefined | SdkKeySpecifier),
		fields?: SdkFieldPolicy,
	},
	UploadFile?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UploadFileKeySpecifier | (() => undefined | UploadFileKeySpecifier),
		fields?: UploadFileFieldPolicy,
	},
	CollectorConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectorConnectionKeySpecifier | (() => undefined | CollectorConnectionKeySpecifier),
		fields?: CollectorConnectionFieldPolicy,
	},
	Collector?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectorKeySpecifier | (() => undefined | CollectorKeySpecifier),
		fields?: CollectorFieldPolicy,
	},
	AnalysisSetting?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AnalysisSettingKeySpecifier | (() => undefined | AnalysisSettingKeySpecifier),
		fields?: AnalysisSettingFieldPolicy,
	},
	Agent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AgentKeySpecifier | (() => undefined | AgentKeySpecifier),
		fields?: AgentFieldPolicy,
	},
	AnalysisStatusStatistics?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AnalysisStatusStatisticsKeySpecifier | (() => undefined | AnalysisStatusStatisticsKeySpecifier),
		fields?: AnalysisStatusStatisticsFieldPolicy,
	},
	AnalysisConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AnalysisConnectionKeySpecifier | (() => undefined | AnalysisConnectionKeySpecifier),
		fields?: AnalysisConnectionFieldPolicy,
	},
	ProjectCaseResultCount?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProjectCaseResultCountKeySpecifier | (() => undefined | ProjectCaseResultCountKeySpecifier),
		fields?: ProjectCaseResultCountFieldPolicy,
	},
	ProjectCaseResultIgnoreCount?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProjectCaseResultIgnoreCountKeySpecifier | (() => undefined | ProjectCaseResultIgnoreCountKeySpecifier),
		fields?: ProjectCaseResultIgnoreCountFieldPolicy,
	},
	TeamConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TeamConnectionKeySpecifier | (() => undefined | TeamConnectionKeySpecifier),
		fields?: TeamConnectionFieldPolicy,
	},
	Management?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ManagementKeySpecifier | (() => undefined | ManagementKeySpecifier),
		fields?: ManagementFieldPolicy,
	},
	SystemStatus?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SystemStatusKeySpecifier | (() => undefined | SystemStatusKeySpecifier),
		fields?: SystemStatusFieldPolicy,
	},
	DiskStatus?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DiskStatusKeySpecifier | (() => undefined | DiskStatusKeySpecifier),
		fields?: DiskStatusFieldPolicy,
	},
	PostgresStatus?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PostgresStatusKeySpecifier | (() => undefined | PostgresStatusKeySpecifier),
		fields?: PostgresStatusFieldPolicy,
	},
	APIConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | APIConnectionKeySpecifier | (() => undefined | APIConnectionKeySpecifier),
		fields?: APIConnectionFieldPolicy,
	},
	API?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | APIKeySpecifier | (() => undefined | APIKeySpecifier),
		fields?: APIFieldPolicy,
	},
	SystemLicense?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SystemLicenseKeySpecifier | (() => undefined | SystemLicenseKeySpecifier),
		fields?: SystemLicenseFieldPolicy,
	},
	Log?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | LogKeySpecifier | (() => undefined | LogKeySpecifier),
		fields?: LogFieldPolicy,
	},
	AgentConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AgentConnectionKeySpecifier | (() => undefined | AgentConnectionKeySpecifier),
		fields?: AgentConnectionFieldPolicy,
	},
	SystemSetting?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SystemSettingKeySpecifier | (() => undefined | SystemSettingKeySpecifier),
		fields?: SystemSettingFieldPolicy,
	},
	SAMLSetting?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SAMLSettingKeySpecifier | (() => undefined | SAMLSettingKeySpecifier),
		fields?: SAMLSettingFieldPolicy,
	},
	PickUserConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PickUserConnectionKeySpecifier | (() => undefined | PickUserConnectionKeySpecifier),
		fields?: PickUserConnectionFieldPolicy,
	},
	PickUser?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PickUserKeySpecifier | (() => undefined | PickUserKeySpecifier),
		fields?: PickUserFieldPolicy,
	},
	TokenConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TokenConnectionKeySpecifier | (() => undefined | TokenConnectionKeySpecifier),
		fields?: TokenConnectionFieldPolicy,
	},
	Token?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TokenKeySpecifier | (() => undefined | TokenKeySpecifier),
		fields?: TokenFieldPolicy,
	},
	AnalyzeTask?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AnalyzeTaskKeySpecifier | (() => undefined | AnalyzeTaskKeySpecifier),
		fields?: AnalyzeTaskFieldPolicy,
	},
	SysMessageRsp?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SysMessageRspKeySpecifier | (() => undefined | SysMessageRspKeySpecifier),
		fields?: SysMessageRspFieldPolicy,
	},
	MyItemsInterfaceRsp?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MyItemsInterfaceRspKeySpecifier | (() => undefined | MyItemsInterfaceRspKeySpecifier),
		fields?: MyItemsInterfaceRspFieldPolicy,
	},
	CaseItemRsp?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CaseItemRspKeySpecifier | (() => undefined | CaseItemRspKeySpecifier),
		fields?: CaseItemRspFieldPolicy,
	},
	ProjectInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProjectInfoKeySpecifier | (() => undefined | ProjectInfoKeySpecifier),
		fields?: ProjectInfoFieldPolicy,
	},
	ProjectTestObjectInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProjectTestObjectInfoKeySpecifier | (() => undefined | ProjectTestObjectInfoKeySpecifier),
		fields?: ProjectTestObjectInfoFieldPolicy,
	},
	ProjectTestResultRsp?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProjectTestResultRspKeySpecifier | (() => undefined | ProjectTestResultRspKeySpecifier),
		fields?: ProjectTestResultRspFieldPolicy,
	},
	ToolItemRsp?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ToolItemRspKeySpecifier | (() => undefined | ToolItemRspKeySpecifier),
		fields?: ToolItemRspFieldPolicy,
	},
	MyItemsCount?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MyItemsCountKeySpecifier | (() => undefined | MyItemsCountKeySpecifier),
		fields?: MyItemsCountFieldPolicy,
	},
	TeamOverviewRsp?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TeamOverviewRspKeySpecifier | (() => undefined | TeamOverviewRspKeySpecifier),
		fields?: TeamOverviewRspFieldPolicy,
	},
	CarInfoStatisFuse?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CarInfoStatisFuseKeySpecifier | (() => undefined | CarInfoStatisFuseKeySpecifier),
		fields?: CarInfoStatisFuseFieldPolicy,
	},
	CarInfoStatis?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CarInfoStatisKeySpecifier | (() => undefined | CarInfoStatisKeySpecifier),
		fields?: CarInfoStatisFieldPolicy,
	},
	ModuleInfoStatis?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ModuleInfoStatisKeySpecifier | (() => undefined | ModuleInfoStatisKeySpecifier),
		fields?: ModuleInfoStatisFieldPolicy,
	},
	RecentStatisticsRsp?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RecentStatisticsRspKeySpecifier | (() => undefined | RecentStatisticsRspKeySpecifier),
		fields?: RecentStatisticsRspFieldPolicy,
	},
	CaseOfToolResultRsp?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CaseOfToolResultRspKeySpecifier | (() => undefined | CaseOfToolResultRspKeySpecifier),
		fields?: CaseOfToolResultRspFieldPolicy,
	},
	CaseResult?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CaseResultKeySpecifier | (() => undefined | CaseResultKeySpecifier),
		fields?: CaseResultFieldPolicy,
	},
	CaseResultListRsp?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CaseResultListRspKeySpecifier | (() => undefined | CaseResultListRspKeySpecifier),
		fields?: CaseResultListRspFieldPolicy,
	},
	ProjectTaskItemList?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProjectTaskItemListKeySpecifier | (() => undefined | ProjectTaskItemListKeySpecifier),
		fields?: ProjectTaskItemListFieldPolicy,
	},
	NewTaskAttributeRsp?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | NewTaskAttributeRspKeySpecifier | (() => undefined | NewTaskAttributeRspKeySpecifier),
		fields?: NewTaskAttributeRspFieldPolicy,
	},
	MyProjectStatisticsRsp?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MyProjectStatisticsRspKeySpecifier | (() => undefined | MyProjectStatisticsRspKeySpecifier),
		fields?: MyProjectStatisticsRspFieldPolicy,
	},
	ProjectInfoRsp?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProjectInfoRspKeySpecifier | (() => undefined | ProjectInfoRspKeySpecifier),
		fields?: ProjectInfoRspFieldPolicy,
	},
	ProjectDetailsRsp?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProjectDetailsRspKeySpecifier | (() => undefined | ProjectDetailsRspKeySpecifier),
		fields?: ProjectDetailsRspFieldPolicy,
	},
	HistoryRep?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | HistoryRepKeySpecifier | (() => undefined | HistoryRepKeySpecifier),
		fields?: HistoryRepFieldPolicy,
	},
	History?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | HistoryKeySpecifier | (() => undefined | HistoryKeySpecifier),
		fields?: HistoryFieldPolicy,
	},
	CaseDetailRsp?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CaseDetailRspKeySpecifier | (() => undefined | CaseDetailRspKeySpecifier),
		fields?: CaseDetailRspFieldPolicy,
	},
	CatalogueTestResultRsp?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CatalogueTestResultRspKeySpecifier | (() => undefined | CatalogueTestResultRspKeySpecifier),
		fields?: CatalogueTestResultRspFieldPolicy,
	},
	LawCatalogueCheckDetailRep?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | LawCatalogueCheckDetailRepKeySpecifier | (() => undefined | LawCatalogueCheckDetailRepKeySpecifier),
		fields?: LawCatalogueCheckDetailRepFieldPolicy,
	},
	CaseClassifyResultRep?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CaseClassifyResultRepKeySpecifier | (() => undefined | CaseClassifyResultRepKeySpecifier),
		fields?: CaseClassifyResultRepFieldPolicy,
	},
	ProjectTask?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProjectTaskKeySpecifier | (() => undefined | ProjectTaskKeySpecifier),
		fields?: ProjectTaskFieldPolicy,
	},
	ActionEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ActionEventKeySpecifier | (() => undefined | ActionEventKeySpecifier),
		fields?: ActionEventFieldPolicy,
	},
	DeviceRsp?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DeviceRspKeySpecifier | (() => undefined | DeviceRspKeySpecifier),
		fields?: DeviceRspFieldPolicy,
	},
	StepBaseV2?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StepBaseV2KeySpecifier | (() => undefined | StepBaseV2KeySpecifier),
		fields?: StepBaseV2FieldPolicy,
	},
	GetCaseAllStepRsp?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GetCaseAllStepRspKeySpecifier | (() => undefined | GetCaseAllStepRspKeySpecifier),
		fields?: GetCaseAllStepRspFieldPolicy,
	},
	StepInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StepInfoKeySpecifier | (() => undefined | StepInfoKeySpecifier),
		fields?: StepInfoFieldPolicy,
	},
	LawCatalogueBaseDetail?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | LawCatalogueBaseDetailKeySpecifier | (() => undefined | LawCatalogueBaseDetailKeySpecifier),
		fields?: LawCatalogueBaseDetailFieldPolicy,
	},
	StepResult?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StepResultKeySpecifier | (() => undefined | StepResultKeySpecifier),
		fields?: StepResultFieldPolicy,
	},
	DetectionProgress?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DetectionProgressKeySpecifier | (() => undefined | DetectionProgressKeySpecifier),
		fields?: DetectionProgressFieldPolicy,
	},
	DetectionProgressV2?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DetectionProgressV2KeySpecifier | (() => undefined | DetectionProgressV2KeySpecifier),
		fields?: DetectionProgressV2FieldPolicy,
	},
	DetectionStepConfig?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DetectionStepConfigKeySpecifier | (() => undefined | DetectionStepConfigKeySpecifier),
		fields?: DetectionStepConfigFieldPolicy,
	},
	ClientDeviceOnline?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ClientDeviceOnlineKeySpecifier | (() => undefined | ClientDeviceOnlineKeySpecifier),
		fields?: ClientDeviceOnlineFieldPolicy,
	},
	LinuxDeviceConnectInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | LinuxDeviceConnectInfoKeySpecifier | (() => undefined | LinuxDeviceConnectInfoKeySpecifier),
		fields?: LinuxDeviceConnectInfoFieldPolicy,
	},
	LawInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | LawInfoKeySpecifier | (() => undefined | LawInfoKeySpecifier),
		fields?: LawInfoFieldPolicy,
	},
	CarInfoRep?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CarInfoRepKeySpecifier | (() => undefined | CarInfoRepKeySpecifier),
		fields?: CarInfoRepFieldPolicy,
	},
	CarInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CarInfoKeySpecifier | (() => undefined | CarInfoKeySpecifier),
		fields?: CarInfoFieldPolicy,
	},
	LawDeatilMd?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | LawDeatilMdKeySpecifier | (() => undefined | LawDeatilMdKeySpecifier),
		fields?: LawDeatilMdFieldPolicy,
	},
	ApkSelectorInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ApkSelectorInfoKeySpecifier | (() => undefined | ApkSelectorInfoKeySpecifier),
		fields?: ApkSelectorInfoFieldPolicy,
	},
	SuiteCustomItemRep?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SuiteCustomItemRepKeySpecifier | (() => undefined | SuiteCustomItemRepKeySpecifier),
		fields?: SuiteCustomItemRepFieldPolicy,
	},
	SuiteCustomItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SuiteCustomItemKeySpecifier | (() => undefined | SuiteCustomItemKeySpecifier),
		fields?: SuiteCustomItemFieldPolicy,
	},
	CaseCustomItemRep?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CaseCustomItemRepKeySpecifier | (() => undefined | CaseCustomItemRepKeySpecifier),
		fields?: CaseCustomItemRepFieldPolicy,
	},
	CaseCustomItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CaseCustomItemKeySpecifier | (() => undefined | CaseCustomItemKeySpecifier),
		fields?: CaseCustomItemFieldPolicy,
	},
	CaseCustomItemResultGroup?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CaseCustomItemResultGroupKeySpecifier | (() => undefined | CaseCustomItemResultGroupKeySpecifier),
		fields?: CaseCustomItemResultGroupFieldPolicy,
	},
	StaticItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StaticItemKeySpecifier | (() => undefined | StaticItemKeySpecifier),
		fields?: StaticItemFieldPolicy,
	},
	ReportViewActionRsp?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReportViewActionRspKeySpecifier | (() => undefined | ReportViewActionRspKeySpecifier),
		fields?: ReportViewActionRspFieldPolicy,
	},
	CaseReport?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CaseReportKeySpecifier | (() => undefined | CaseReportKeySpecifier),
		fields?: CaseReportFieldPolicy,
	},
	SysAuditorReport?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SysAuditorReportKeySpecifier | (() => undefined | SysAuditorReportKeySpecifier),
		fields?: SysAuditorReportFieldPolicy,
	},
	CaseCheckedItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CaseCheckedItemKeySpecifier | (() => undefined | CaseCheckedItemKeySpecifier),
		fields?: CaseCheckedItemFieldPolicy,
	},
	CarModelListRsp?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CarModelListRspKeySpecifier | (() => undefined | CarModelListRspKeySpecifier),
		fields?: CarModelListRspFieldPolicy,
	},
	CarModelItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CarModelItemKeySpecifier | (() => undefined | CarModelItemKeySpecifier),
		fields?: CarModelItemFieldPolicy,
	},
	CarInfoItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CarInfoItemKeySpecifier | (() => undefined | CarInfoItemKeySpecifier),
		fields?: CarInfoItemFieldPolicy,
	},
	CarInfoItemSelector?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CarInfoItemSelectorKeySpecifier | (() => undefined | CarInfoItemSelectorKeySpecifier),
		fields?: CarInfoItemSelectorFieldPolicy,
	},
	CarModelItemSelector?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CarModelItemSelectorKeySpecifier | (() => undefined | CarModelItemSelectorKeySpecifier),
		fields?: CarModelItemSelectorFieldPolicy,
	},
	VersionSelector?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VersionSelectorKeySpecifier | (() => undefined | VersionSelectorKeySpecifier),
		fields?: VersionSelectorFieldPolicy,
	},
	CommonalityAutoTaskReportRep?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CommonalityAutoTaskReportRepKeySpecifier | (() => undefined | CommonalityAutoTaskReportRepKeySpecifier),
		fields?: CommonalityAutoTaskReportRepFieldPolicy,
	},
	ReportSystemUser?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReportSystemUserKeySpecifier | (() => undefined | ReportSystemUserKeySpecifier),
		fields?: ReportSystemUserFieldPolicy,
	},
	ReportFile?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReportFileKeySpecifier | (() => undefined | ReportFileKeySpecifier),
		fields?: ReportFileFieldPolicy,
	},
	ReportCVESec?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReportCVESecKeySpecifier | (() => undefined | ReportCVESecKeySpecifier),
		fields?: ReportCVESecFieldPolicy,
	},
	ReportCVESecRisk?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReportCVESecRiskKeySpecifier | (() => undefined | ReportCVESecRiskKeySpecifier),
		fields?: ReportCVESecRiskFieldPolicy,
	},
	ReportApkSignature?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReportApkSignatureKeySpecifier | (() => undefined | ReportApkSignatureKeySpecifier),
		fields?: ReportApkSignatureFieldPolicy,
	},
	ReportApkManifest?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReportApkManifestKeySpecifier | (() => undefined | ReportApkManifestKeySpecifier),
		fields?: ReportApkManifestFieldPolicy,
	},
	ReportCheckSec?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReportCheckSecKeySpecifier | (() => undefined | ReportCheckSecKeySpecifier),
		fields?: ReportCheckSecFieldPolicy,
	},
	ComplianceApkComponents?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ComplianceApkComponentsKeySpecifier | (() => undefined | ComplianceApkComponentsKeySpecifier),
		fields?: ComplianceApkComponentsFieldPolicy,
	},
	Client?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ClientKeySpecifier | (() => undefined | ClientKeySpecifier),
		fields?: ClientFieldPolicy,
	},
	OnlineUsbDevice?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OnlineUsbDeviceKeySpecifier | (() => undefined | OnlineUsbDeviceKeySpecifier),
		fields?: OnlineUsbDeviceFieldPolicy,
	},
	MyProjectStatistics?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MyProjectStatisticsKeySpecifier | (() => undefined | MyProjectStatisticsKeySpecifier),
		fields?: MyProjectStatisticsFieldPolicy,
	},
	StaticUserItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StaticUserItemKeySpecifier | (() => undefined | StaticUserItemKeySpecifier),
		fields?: StaticUserItemFieldPolicy,
	},
	ClientAlertMsg?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ClientAlertMsgKeySpecifier | (() => undefined | ClientAlertMsgKeySpecifier),
		fields?: ClientAlertMsgFieldPolicy,
	},
	CaseInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CaseInfoKeySpecifier | (() => undefined | CaseInfoKeySpecifier),
		fields?: CaseInfoFieldPolicy,
	},
	ProjectSelectorList?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProjectSelectorListKeySpecifier | (() => undefined | ProjectSelectorListKeySpecifier),
		fields?: ProjectSelectorListFieldPolicy,
	},
	ProjectTestObjectList?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProjectTestObjectListKeySpecifier | (() => undefined | ProjectTestObjectListKeySpecifier),
		fields?: ProjectTestObjectListFieldPolicy,
	},
	ProjectTestObjectSystemList?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProjectTestObjectSystemListKeySpecifier | (() => undefined | ProjectTestObjectSystemListKeySpecifier),
		fields?: ProjectTestObjectSystemListFieldPolicy,
	},
	ProjectClientList?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProjectClientListKeySpecifier | (() => undefined | ProjectClientListKeySpecifier),
		fields?: ProjectClientListFieldPolicy,
	},
	ProjectClientDeviceList?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProjectClientDeviceListKeySpecifier | (() => undefined | ProjectClientDeviceListKeySpecifier),
		fields?: ProjectClientDeviceListFieldPolicy,
	},
	CaseTestProcessRecordRsp?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CaseTestProcessRecordRspKeySpecifier | (() => undefined | CaseTestProcessRecordRspKeySpecifier),
		fields?: CaseTestProcessRecordRspFieldPolicy,
	},
	CaseTestProcessRsp?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CaseTestProcessRspKeySpecifier | (() => undefined | CaseTestProcessRspKeySpecifier),
		fields?: CaseTestProcessRspFieldPolicy,
	},
	UploadData?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UploadDataKeySpecifier | (() => undefined | UploadDataKeySpecifier),
		fields?: UploadDataFieldPolicy,
	},
	ClientDeviceOnlineV2?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ClientDeviceOnlineV2KeySpecifier | (() => undefined | ClientDeviceOnlineV2KeySpecifier),
		fields?: ClientDeviceOnlineV2FieldPolicy,
	},
	AppSelectedList?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppSelectedListKeySpecifier | (() => undefined | AppSelectedListKeySpecifier),
		fields?: AppSelectedListFieldPolicy,
	},
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	},
	LoginPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | LoginPayloadKeySpecifier | (() => undefined | LoginPayloadKeySpecifier),
		fields?: LoginPayloadFieldPolicy,
	},
	ManagementMutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ManagementMutationKeySpecifier | (() => undefined | ManagementMutationKeySpecifier),
		fields?: ManagementMutationFieldPolicy,
	},
	SettingMutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SettingMutationKeySpecifier | (() => undefined | SettingMutationKeySpecifier),
		fields?: SettingMutationFieldPolicy,
	},
	TeamMutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TeamMutationKeySpecifier | (() => undefined | TeamMutationKeySpecifier),
		fields?: TeamMutationFieldPolicy,
	},
	TeamProjectMutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TeamProjectMutationKeySpecifier | (() => undefined | TeamProjectMutationKeySpecifier),
		fields?: TeamProjectMutationFieldPolicy,
	},
	TokenMutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TokenMutationKeySpecifier | (() => undefined | TokenMutationKeySpecifier),
		fields?: TokenMutationFieldPolicy,
	},
	AgentMutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AgentMutationKeySpecifier | (() => undefined | AgentMutationKeySpecifier),
		fields?: AgentMutationFieldPolicy,
	},
	ActionPushResult?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ActionPushResultKeySpecifier | (() => undefined | ActionPushResultKeySpecifier),
		fields?: ActionPushResultFieldPolicy,
	},
	Subscription?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SubscriptionKeySpecifier | (() => undefined | SubscriptionKeySpecifier),
		fields?: SubscriptionFieldPolicy,
	},
	Stream?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StreamKeySpecifier | (() => undefined | StreamKeySpecifier),
		fields?: StreamFieldPolicy,
	},
	PageInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageInfoKeySpecifier | (() => undefined | PageInfoKeySpecifier),
		fields?: PageInfoFieldPolicy,
	},
	StepBase?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StepBaseKeySpecifier | (() => undefined | StepBaseKeySpecifier),
		fields?: StepBaseFieldPolicy,
	}
};