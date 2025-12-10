import { useMemo, useCallback } from 'react'
import { PAGE_ENDPOINTS } from '@constants/'
import { useAuth, useUser } from '@contexts/'

export interface MenuItem {
  title: string
  link: string
  icon: string
  requireAuth?: boolean
  children?: MenuItem[]
}

export const useSidebarNavigation = () => {
  const { isAuthenticated, openAuthModal } = useAuth()
  const { user } = useUser()

  const menuItems = useMemo(() => {
    const baseItems: MenuItem[] = []

    if (!isAuthenticated) {
      return baseItems
    }

    const authItems: MenuItem[] = [
      {
        title: 'Проекты',
        link: `#`,
        icon: '#',
        requireAuth: true,
        children: [
          {
            title: 'Список проектов',
            link: `${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.HOME}`,
            icon: '#',
            requireAuth: true,
          },
          ...(user?.projectData || []).map((el) => ({
            title: el.name,
            link: `${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.PROJECT}/${el.id}`,
            icon: '#',
            requireAuth: true,
          })),
          {
            title: 'Новый проект',
            link: `${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.PROJECT}/new`,
            icon: '#',
            requireAuth: true,
          },
        ],
      },
      {
        title: 'Планировщик',
        link: '#',
        icon: '#',
        requireAuth: true,
        children: [
          {
            title: 'Список задач',
            link: '#',
            icon: '#',
            requireAuth: true,
          },
          {
            title: 'Создать задачу',
            link: '#',
            icon: '#',
            requireAuth: true,
          },
        ],
      },
      {
        title: 'Ресурсы',
        link: '/resources',
        icon: '#',
        requireAuth: true,
        children: [
          {
            title: 'Мониторинг',
            link: '#',
            icon: '#',
            requireAuth: true,
          },
          {
            title: 'Аналитика',
            link: '#',
            icon: '#',
            requireAuth: true,
          },
        ],
      },
    ]

    return [...baseItems, ...authItems]
  }, [isAuthenticated, user?.projectData])

  const handleMenuItemClick = useCallback(
    (e: React.MouseEvent, item: MenuItem) => {
      if (item.requireAuth && !isAuthenticated) {
        e.preventDefault()
        openAuthModal('login')
      }
    },
    [isAuthenticated, openAuthModal]
  )

  return {
    menuItems,
    handleMenuItemClick,
    isAuthenticated,
  }
}
