process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('babel-register');
require('dotenv').config();
let mongoose = require('mongoose');
let Constants = require('../config/constants').default;
let Backup = require('../models/backup').default;
let ForceUtil = require('../lib/force.util').default;
let Util = require('../lib/util').default;

mongoose.Promise = global.Promise;
mongoose.connect(Constants.mongo.uri);
mongoose.connection.on('error', (err) => {
  throw err;
});

const types = ['InstalledPackage',
  'CustomLabels',
  'CustomLabel',
  'StaticResource',
  'Scontrol',
  'Certificate',
  'AuraDefinitionBundle',
  'ApexComponent',
  'ApexPage',
  'Queue',
  'ExternalDataSource',
  'NamedCredential',
  'ExternalServiceRegistration',
  'Role',
  'Group',
  'GlobalValueSet',
  'StandardValueSet',
  'CustomPermission',
  'CustomObject',
  'CustomField',
  'Index',
  'BusinessProcess',
  'CompactLayout',
  'RecordType',
  'WebLink',
  'ValidationRule',
  'SharingReason',
  'ListView',
  'FieldSet',
  'ReportType',
  'Report',
  'Dashboard',
  'AnalyticSnapshot',
  'CustomFeedFilter',
  'Document',
  'CustomPageWebLink',
  'Letterhead',
  'EmailTemplate',
  'FlexiPage',
  'CustomTab',
  'CustomApplicationComponent',
  'CustomApplication',
  'EmbeddedServiceConfig',
  'EmbeddedServiceBranding',
  'Flow',
  'FlowDefinition',
  'EventSubscription',
  'EventDelivery',
  'AssignmentRules',
  'AssignmentRule',
  'AutoResponseRules',
  'AutoResponseRule',
  'EscalationRules',
  'EscalationRule',
  'PostTemplate',
  'ApprovalProcess',
  'HomePageComponent',
  'HomePageLayout',
  'CustomObjectTranslation',
  'GlobalValueSetTranslation',
  'StandardValueSetTranslation',
  'ApexClass',
  'ApexTrigger',
  'ApexTestSuite',
  'Profile',
  'PermissionSet',
  'CustomMetadata',
  'DataCategoryGroup',
  'RemoteSiteSetting',
  'CspTrustedSite',
  'MatchingRules',
  'MatchingRule',
  'DuplicateRule',
  'CleanDataService',
  'AuthProvider',
  'EclairGeoData',
  'CustomSite',
  'ChannelLayout',
  'ContentAsset',
  'SharingRules',
  'SharingOwnerRule',
  'SharingCriteriaRule',
  'SharingSet',
  'Community',
  'CallCenter',
  'ConnectedApp',
  'AppMenu',
  'DelegateGroup',
  'SiteDotCom',
  'SamlSsoConfig',
  'CorsWhitelistOrigin',
  'ActionLinkGroupTemplate',
  'TransactionSecurityPolicy',
  'SynonymDictionary',
  'PathAssistant',
  'LeadConvertSettings',
  'PlatformCachePartition',
  'Settings'];

const snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let totalBackups = 0;
let current = 0;

let retrieveBackups = async () => {
  return await Backup.aggregate([
    {
      $lookup: {
        from: 'organizations',
        localField: '_organization',
        foreignField: '_id',
        as: 'organization',
      },
    },
  ]);
};

let startPull = async (organization) => {
  return await ForceUtil.pullMetadata(types, organization);
};

let checkStatus = async (organization, pull) => {
  let res = await ForceUtil.checkBackupStatus(organization, pull.id);
  if (res.code === Util.code.ok) {
    await snooze(4000);
    return await checkStatus(organization, pull);
  } else {
    console.log('Backup complete for ' + organization._id);
    return current ++;
  }
};

let complete = () => {
  if(current === totalBackups) {
    console.log('All backups completed');
    mongoose.connection.close();
  }
};

let start = async () => {
  let backups = await retrieveBackups();
  totalBackups = backups.length;
  backups.forEach(async (backup) => {
    const organization = backup.organization[0];
    console.log('Starting backup for ' + organization._id);
    let pull = await startPull(organization);
    await checkStatus(organization, pull);
    complete();
  });
};

start();
