// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {

  return [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'mdi:home-outline',
      subject: 'all',
      action: 'manage'
    }, 
    {
      sectionTitle: 'Contacts'
    },
    {
      title: 'Profiles',
      icon: 'mdi:account-multiple-outline',
      subject: ['PROFILE', 'PROFILE:LIST', 'PROFILE:LIST:VIEWALL'],
      children: [
        {
          // disabled: true,
          title: 'Create New Profile',
          icon: 'mdi:account-plus-outline',
          path: '/profiles/create',
          subject: ['PROFILE', 'PROFILE:CREATE'],
          action: 'manage'
        },
        {
          title: 'Search Profiles',
          icon: 'mdi:account-search-outline',
          path: '/profiles/list',
          action: 'manage',
          subject: ['PROFILE', 'PROFILE:LIST', 'PROFILE:LIST:VIEWALL']
        }
      ]
    },
    {
      sectionTitle: 'Tasks'
    },
    {
      disabled: true,
      title: 'Search Tasks',
      path: '/tasks/list',
      icon: 'mdi:clipboard-search-outline',
      action: 'manage',
      subject: ['TASK', 'TASK:LIST', 'TASK:LIST:VIEWALL']
    },
    {
      sectionTitle: 'Accounting'
    },
    {
      // disabled: true,
      title: 'Search Transactions',
      icon: 'mdi:credit-card-search-outline',
      path: '/transactions/list',
      action: 'manage',
      subject: ['ACCOUNTING, ACCOUNTING:TRANSACTIONS', 'ACCOUNTING:TRANSACTIONS:VIEWALL']
    },
    {
      sectionTitle: 'Setting'
    },
    {
      title: 'Access Management',
      icon: 'mdi:cog',
      path: '/testPage',
      action: 'manage',
      subject: [
        'SETTING',
        'SETTING:ACCESSMANAGEMENT',
        'SETTING:ACCESSMANAGEMENT:ROLES',
        'SETTING:ACCESSMANAGEMENT:TEAMS',
        'SETTING:ACCESSMANAGEMENT:USERS'
      ]

      // path: '/accessmanagement'
    },
    {
      title: 'System Config',
      icon: 'mdi:cog',
      action: 'manage',
      subject: ['SETTING', 'SETTING:SYSTEMCONFIGURATION'],
      children: [
        {
          disabled: true,
          title: 'Workflow',
          icon: 'mdi:sitemap-outline',
          path: '/system/workflow'
        },
        {
          title: 'Preset Values',
          icon: 'mdi:sitemap-outline',
          path: '/presetValues'
        },
        {
          title: 'Profile Setting',
          icon: 'mdi:sitemap-outline',
          path: '/profileSetting'
        },
        {
          disabled: true,
          title: 'System Template',
          icon: 'mdi:sitemap-outline',
          path: '/system/customfield'
        },
        {
          disabled: true,
          title: 'Preset Values',
          icon: 'mdi:sitemap-outline',
          path: '/system/ipwhitelist'
        }
      ]
    }
  ]
}

export default navigation
