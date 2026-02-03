import { useUser } from '../../contexts/'
import { ProfileData, statusMap, userRoleMap } from '../../types/user'
import stylesProfile from './styles/ProfileTab.module.scss'
import stylesGeneral from './styles/Account.module.scss'
import { useParams } from 'react-router-dom'
import { PAGE_ENDPOINTS } from '../../constants'
import { useHeaderStore } from '../../stores/'
import { useEffect, useState } from 'react'
import { Breadcrumbs } from '@components/'
import { SyncLoader } from 'react-spinners'

export const ViewProfileTab = () => {
  const { getUserProfile, isLoading, error } = useUser()
  const [profileData, setProfileData] = useState<Partial<ProfileData>>({})
  const { setHeaderContent } = useHeaderStore()
  const { userId } = useParams<{ userId: string }>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await getUserProfile(parseInt(userId || '-1'))
        console.log(profile)
        setProfileData(profile)
        setHeaderContent(
          <Breadcrumbs
            items={[
              {
                text: 'Профиль пользователя',
                link: `${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.ACCOUNT.INDEX}/${PAGE_ENDPOINTS.ACCOUNT.PROFILE}`,
              },
              { text: profile.username || 'Пользователь' },
            ]}
          />
        )
      } catch (e) {
        console.log(e)
      }
    }

    fetchData()
  }, [setHeaderContent, userId])

  if (isLoading) {
    return (
      <div className={stylesGeneral.pageContainer}>
        <div className={stylesProfile.profileTab}>
          <div>Загрузка профиля</div>
          <SyncLoader color="#000000" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={stylesGeneral.pageContainer}>
        <div className={stylesProfile.profileTab}>
          <div>{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={stylesGeneral.pageContainer}>
      <div className={stylesProfile.profileTab}>
        <div className={stylesProfile.form}>
          <div className={stylesProfile.editableSection}>
            <h3 className={stylesProfile.sectionTitle}>
              {profileData.username}
            </h3>

            <div className={stylesProfile.fieldGroup}>
              <label className={stylesProfile.label}>Статус</label>
              <div className={stylesProfile.statusDiv}>
                {statusMap[profileData.status || 'unknown']}
              </div>
            </div>

            <div className={stylesProfile.fieldGroup}>
              <label className={stylesProfile.label}>Имя пользователя</label>
              <div className={stylesProfile.field}>{profileData.username}</div>
            </div>

            {profileData.firstName && (
              <div className={stylesProfile.nameRow}>
                <div className={stylesProfile.fieldGroup}>
                  <label className={stylesProfile.label}>Имя</label>
                  <div className={stylesProfile.field}>
                    {profileData.firstName}
                  </div>
                </div>

                <div className={stylesProfile.fieldGroup}>
                  <label className={stylesProfile.label}>Фамилия</label>
                  <div className={stylesProfile.field}>
                    {profileData.lastName}
                  </div>
                </div>

                {profileData.fatherName && (
                  <div className={stylesProfile.fieldGroup}>
                    <label className={stylesProfile.label}>Отчество</label>
                    <div className={stylesProfile.field}>
                      {profileData.fatherName}
                    </div>
                  </div>
                )}
              </div>
            )}

            {profileData.email && (
              <div className={stylesProfile.fieldGroup}>
                <label className={stylesProfile.label}>Почта</label>
                <div className={stylesProfile.field}>{profileData.email}</div>
              </div>
            )}

            {profileData.phone && (
              <div className={stylesProfile.fieldGroup}>
                <label className={stylesProfile.label}>Номер телефона</label>
                <div className={stylesProfile.field}>
                  {profileData.phone || 'Не указано'}
                </div>
              </div>
            )}

            {profileData.country && (
              <div className={stylesProfile.fieldGroup}>
                <label className={stylesProfile.label}>Страна</label>
                <div className={stylesProfile.field}>
                  {profileData.country || 'Не указано'}
                </div>
              </div>
            )}

            {profileData.city && (
              <div className={stylesProfile.fieldGroup}>
                <label className={stylesProfile.label}>Город</label>
                <div className={stylesProfile.field}>
                  {profileData.city || 'Не указано'}
                </div>
              </div>
            )}

            {profileData.company && (
              <>
                <div className={stylesProfile.fieldGroup}>
                  <label className={stylesProfile.label}>Компания</label>
                  <div className={stylesProfile.field}>
                    {profileData.company}
                  </div>
                </div>

                {profileData.jobPosition && (
                  <div className={stylesProfile.fieldGroup}>
                    <label className={stylesProfile.label}>Должность</label>
                    <div className={stylesProfile.field}>
                      {profileData.jobPosition}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {profileData.teams && profileData.teams.length > 0 && (
            <div className={stylesProfile.teamsSection}>
              <h3 className={stylesProfile.sectionTitle}>Команды</h3>
              <table className={stylesProfile.teamsTable}>
                <thead>
                  <tr>
                    <th>Имя команды</th>
                    <th>Роль</th>
                  </tr>
                </thead>
                <tbody>
                  {profileData.teams.map((team, index) => (
                    <tr key={team.id || index}>
                      <td>{team.name}</td>
                      <td>{userRoleMap[team.role]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
