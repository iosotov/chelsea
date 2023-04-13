// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'mdi:home-outline'
    },
    {
      sectionTitle: 'Profiles'
    },
    {
      title: 'Contacts',
      icon: 'mdi:account-multiple-outline',
      children: [
        {
          // disabled: true,
          title: 'Create New Profile',
          icon: 'mdi:account-plus-outline',
          path: '/contact/create'
        },
        {
          title: 'Search Profiles',
          icon: 'mdi:account-search-outline',
          path: '/contact/list'
        }
      ]
    },
    {
      sectionTitle: 'Tasks'
    },
    {
      // disabled: true,
      title: 'Search Tasks',
      path: '/task',
      icon: 'mdi:clipboard-search-outline'
    },
    {
      sectionTitle: 'Accounting'
    },
    {
      // disabled: true,
      title: 'Search Transactions',
      icon: 'mdi:credit-card-search-outline',
      path: '/transaction'
    },
    {
      sectionTitle: 'Setting'
    },
    {
      title: 'System Config',
      icon: 'mdi:cog',
      children: [
        {
          disabled: true,
          title: 'Workflow',
          icon: 'mdi:sitemap-outline',
          path: '/system/workflow'
        }
      ]
    }
  ]
}

export default navigation
