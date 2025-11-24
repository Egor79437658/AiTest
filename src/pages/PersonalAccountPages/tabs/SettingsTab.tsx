import { useAuth } from '@contexts/'
import { User, SettingsData } from '@types/'
import type React from 'react'
import { useForm, Controller } from 'react-hook-form'
import stylesSettings from '../styles/SettingsTab.module.scss'
import stylesGeneral from '../styles/Account.module.scss'

export const SettingsTab: React.FC = () => {
  const { user, updateUser } = useAuth()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsData>({ defaultValues: user?.settingsData })

  const handleSave = (data: SettingsData) => {
    if (user) {
      data.company = !!data.company
      data.jobPosition = !!data.jobPosition
      user.settingsData = data
      console.log(user)
      updateUser(user)
    }
  }

  const hasCompany = user?.profileData.company !== null

  return (
    <div className={stylesGeneral.pageContainer}>
    <div className={stylesSettings.settingsTab}>
      <form onSubmit={handleSubmit(handleSave)} className={stylesSettings.form}>
        <div className={stylesSettings.settingsSection}>
          <h3 className={stylesSettings.sectionTitle}>Настройки отображения</h3>
          
          <div className={stylesSettings.fieldGroup}>
            <label className={stylesSettings.label}>Тема</label>
            <Controller
              name="theme"
              control={control}
              render={({ field }) => (
                <select {...field} className={stylesSettings.select}>
                  <option value="light">Светлая</option>
                  <option value="dark">Тёмная</option>
                </select>
              )}
            />
          </div>

          <div className={stylesSettings.fieldGroup}>
            <label className={stylesSettings.label}>Язык</label>
            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <select {...field} className={stylesSettings.select}>
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                </select>
              )}
            />
          </div>

          <h4 className={stylesSettings.subsectionTitle}>Видимость информации в профиле</h4>
          
          <div className={stylesSettings.checkboxGrid}>
            <div className={stylesSettings.checkboxGroup}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <label className={stylesSettings.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className={stylesSettings.checkbox}
                    />
                    <span className={stylesSettings.checkboxText}>Имя</span>
                  </label>
                )}
              />
            </div>

            <div className={stylesSettings.checkboxGroup}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <label className={stylesSettings.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className={stylesSettings.checkbox}
                    />
                    <span className={stylesSettings.checkboxText}>Email</span>
                  </label>
                )}
              />
            </div>

            <div className={stylesSettings.checkboxGroup}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <label className={stylesSettings.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className={stylesSettings.checkbox}
                    />
                    <span className={stylesSettings.checkboxText}>Телефон</span>
                  </label>
                )}
              />
            </div>

            <div className={stylesSettings.checkboxGroup}>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <label className={stylesSettings.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className={stylesSettings.checkbox}
                    />
                    <span className={stylesSettings.checkboxText}>Страна</span>
                  </label>
                )}
              />
            </div>

            <div className={stylesSettings.checkboxGroup}>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <label className={stylesSettings.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className={stylesSettings.checkbox}
                    />
                    <span className={stylesSettings.checkboxText}>Город</span>
                  </label>
                )}
              />
            </div>

            {hasCompany && (
              <>
                <div className={stylesSettings.checkboxGroup}>
                  <Controller
                    name="company"
                    control={control}
                    render={({ field }) => (
                      <label className={stylesSettings.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={field.value || false}
                          onChange={field.onChange}
                          className={stylesSettings.checkbox}
                        />
                        <span className={stylesSettings.checkboxText}>Компания</span>
                      </label>
                    )}
                  />
                </div>

                <div className={stylesSettings.checkboxGroup}>
                  <Controller
                    name="jobPosition"
                    control={control}
                    render={({ field }) => (
                      <label className={stylesSettings.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={field.value || false}
                          onChange={field.onChange}
                          className={stylesSettings.checkbox}
                        />
                        <span className={stylesSettings.checkboxText}>Должность</span>
                      </label>
                    )}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className={stylesSettings.teamsSection}>
          <h3 className={stylesSettings.sectionTitle}>Видимость команд</h3>
          {user?.profileData.teams && user.profileData.teams.length > 0 ? (
            <table className={stylesSettings.teamsTable}>
              <thead>
                <tr>
                  <th>Имя команды</th>
                  <th>Ваша роль</th>
                  <th>Отображать</th>
                </tr>
              </thead>
              <tbody>
                {user.profileData.teams.map((team, index) => (
                  <tr key={index}>
                    <td>{team.name}</td>
                    <td>{team.role}</td>
                    <td>
                      <Controller
                        name={`teams.${index}`}
                        control={control}
                        render={({ field }) => (
                          <label className={stylesSettings.checkboxLabel}>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className={stylesSettings.checkbox}
                            />
                          </label>
                        )}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={stylesSettings.noTeams}>У вас нет команд!</p>
          )}
        </div>

        <div className={stylesSettings.actions}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={stylesGeneral.submitButton}
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить настройки'}
          </button>
        </div>
      </form>
    </div>
    </div>
  )
}