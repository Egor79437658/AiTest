import { useUser } from '@contexts/'
import { SettingsData } from '@interfaces/'
import type React from 'react'
import { useForm, Controller } from 'react-hook-form'
import stylesSettings from '../styles/SettingsTab.module.scss'
import { useHeaderStore } from '@stores/'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import stylesGeneral from '../styles/Account.module.scss'
import { Breadcrumbs, QuestionDialog } from '@components/'
import { SyncLoader } from 'react-spinners'

export const SettingsTab: React.FC = () => {
  const { user, updateUserSettings, isLoading, deleteMyAccount } = useUser()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsData>({ defaultValues: user?.settingsData })
  const { setHeaderContent } = useHeaderStore()
  const [showDiag, setShowDiag] = useState(false)
  const [messageContent, setMessageContent] = useState(<></>)
  const messageDiv = useRef<HTMLDivElement>(null)
  const navigator = useNavigate()

  useEffect(() => {
    if (user?.profileData.username) {
      setHeaderContent(
        <Breadcrumbs
          items={[{ text: user.profileData.username }, { text: 'настройки' }]}
        />
      )
    }
  }, [setHeaderContent, user?.profileData.username])

  const setTempClass = (className: string) => {
    if (messageDiv.current) {
      messageDiv.current.classList.add(className)
    }
    setTimeout(() => {
      if (messageDiv.current) {
        messageDiv.current.classList.remove(className)
      }
    }, 4000)
  }

  const handleSave = async (data: SettingsData) => {
    if (user) {
      data.company = !!data.company
      data.jobPosition = !!data.jobPosition
      user.settingsData = data
      try {
        const res = await updateUserSettings(user)
        if (res.status !== 200) {
          setMessageContent(
            <>
              При сохранении произошла ошибка!
              <br />
              {res.message || ''}
            </>
          )
          setTempClass(stylesSettings.showError)
        } else {
          if (messageDiv.current) {
            messageDiv.current.classList.remove(stylesSettings.showError)
          }
        }
      } catch (e: any) {
        setMessageContent(
          <>
            При сохранении произошла ошибка!
            <br />
            {e.message || ''}
          </>
        )
        setTempClass(stylesSettings.showError)
      }
    }
  }

  const handleDelete = async () => {
    try {
      setMessageContent(<>Удаляем...</>)
      const res = await deleteMyAccount()
      // if(Math.random() < 0.5) {res.status = 201}
      if (res.status !== 200) {
        setMessageContent(
          <>
            При удалении произошла ошибка!
            <br />
            {res.message || ''}
          </>
        )
        setTempClass(stylesSettings.showError)
      } else {
        if (messageDiv.current) {
          messageDiv.current.classList.remove(stylesSettings.showError)
        }
        navigator('/')
      }
    } catch (e: any) {
      setMessageContent(
        <>
          При удалении произошла ошибка!
          <br />
          {e.message || ''}
        </>
      )
      setTempClass(stylesSettings.showError)
    }
  }

  const hasCompany = user?.profileData.company !== null

  if (isLoading) {
    return (
      <div className={stylesGeneral.pageContainer}>
        <div>Загрузка профиля</div>
        <SyncLoader color="#000000" />
      </div>
    )
  }

  return (
    <div className={stylesGeneral.pageContainer}>
      <div className={stylesSettings.settingsTab}>
        <form
          onSubmit={handleSubmit(handleSave)}
          className={stylesSettings.form}
        >
          <div className={stylesSettings.settingsSection}>
            <h3 className={stylesSettings.sectionTitle}>
              Настройки отображения
            </h3>

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

            <h4 className={stylesSettings.subsectionTitle}>
              Видимость информации в профиле
            </h4>

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
                      <span className={stylesSettings.checkboxText}>
                        Телефон
                      </span>
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
                      <span className={stylesSettings.checkboxText}>
                        Страна
                      </span>
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
                          <span className={stylesSettings.checkboxText}>
                            Компания
                          </span>
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
                          <span className={stylesSettings.checkboxText}>
                            Должность
                          </span>
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
                                checked={field.value.flag}
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
              className={`${stylesGeneral.submitButton} ${stylesSettings.sendSettingsBtn}`}
            >
              {isSubmitting ? 'Сохранение...' : 'Сохранить настройки'}
            </button>
          </div>
        </form>
        <button
          type="button"
          onClick={() => setShowDiag(!showDiag)}
          className={`${stylesGeneral.submitButton} ${stylesSettings.deleteBtn}`}
        >
          Удалить аккаунт
        </button>
        <div className={stylesSettings.messageDiv} ref={messageDiv}>
          {messageContent}
        </div>
      </div>
      <QuestionDialog
        showQuestion={showDiag}
        changeShowQuestion={setShowDiag}
        onYesClick={handleDelete}
        className={stylesSettings.dialog}
      >
        Вы уверены, что хотите удалить аккаунт? <br />
        Это действие невозможно отменить
      </QuestionDialog>
    </div>
  )
}
