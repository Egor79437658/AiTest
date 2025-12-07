import { useAuth, useUser } from '@contexts/'
import { ProfileData, userRoleMap } from '@interfaces/'
import type React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useEffect } from 'react'

import stylesProfile from '../styles/ProfileTab.module.scss'
import stylesGeneral from '../styles/Account.module.scss'
import { useAuthStore, useHeaderStore } from '@stores/'
import { Link } from 'react-router-dom'
import { PAGE_ENDPOINTS } from '@constants/'

const statusMap = {
  active: 'Активен',
  blocked: 'Заблокирован',
  deleted: 'Удалён',
  unknown: 'неизвестно',
}

export const ProfileTab: React.FC = () => {
  const { openAuthModal } = useAuth()
  const { setOnConfirmAction } = useAuthStore()
  const { user, updateUserProfile, isLoading } = useUser()
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileData>({ defaultValues: user?.profileData })
  const { setHeaderContent } = useHeaderStore()

  useEffect(
    () =>
      setHeaderContent(
        <div>
          <Link to="/">ЯМП&nbsp;</Link>
          &mdash;&nbsp; {user?.profileData.username} &nbsp;&mdash;&nbsp; профиль
        </div>
      ),
    [setHeaderContent]
  )

  const company = watch('company')
  const email = watch('email')
  const phone = watch('phone')

  useEffect(() => {
    if (company && company !== '') {
      const currentEmployeeCount = watch('employeeCount')
      const currentJobPosition = watch('jobPosition')

      if (!currentEmployeeCount) {
        setValue('employeeCount', '<10')
      }
      if (!currentJobPosition) {
        setValue('jobPosition', '')
      }
    }
  }, [company, setValue, watch])

  const handleSave = (data: ProfileData) => {
    if (user) {
      if (user.profileData.phone !== phone) {
        const res = confirm(
          'Ваш телефон не подтвержден. При сохранении он не будет обновлен. Вы уверены, что хотите продолжить?'
        )
        if (!res) {
          return
        }
      }
      if (user.profileData.email !== email) {
        const res = confirm(
          'Ваша почта не подтверждена. При сохранении она не будет обновлена. Вы уверены, что хотите продолжить?'
        )
        if (!res) {
          return
        }
      }

      if (!data.company) {
        data.employeeCount = null
        data.jobPosition = null
        data.company = null
      }
      !data.fatherName && data.fatherName == null
      if (user.profileData.email !== data.email) {
        data.emailConfirmed == false
      }
      if (user.profileData.phone !== data.phone) {
        data.phoneConfirmed = false
      }
      user.profileData = data
      console.log(user)
      updateUserProfile(user)
    }
  }

  const handleConfirmEmail = () => {
    console.log('Confirm email')
    setOnConfirmAction((type) => {
      updateUserProfile({
        profileData: { ...user?.profileData, emailConfirmed: true },
      })
    })
    openAuthModal('confirmEmail', email)
  }

  const handleConfirmPhone = () => {
    setOnConfirmAction((type) => {
      updateUserProfile({
        profileData: { ...user?.profileData, phoneConfirmed: true },
      })
    })
    console.log('Confirm phone')
    openAuthModal('confirmPhone', phone)
  }

  if (isLoading) {
    return (
      <div className={stylesGeneral.pageContainer}>
        <div className={stylesProfile.profileTab}>
          <div>Загрузка профиля...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={stylesGeneral.pageContainer}>
        <div className={stylesProfile.profileTab}>
          <div>Пользователь не найден</div>
        </div>
      </div>
    )
  }

  return (
    <div className={stylesGeneral.pageContainer}>
      <div className={stylesProfile.profileTab}>
        <form
          onSubmit={handleSubmit(handleSave)}
          className={stylesProfile.form}
        >
          <div className={stylesProfile.editableSection}>
            <h3 className={stylesProfile.sectionTitle}>Ваш профиль</h3>
            <label className={stylesProfile.label}>Статус</label>
            <div className={stylesProfile.statusDiv}>
              {statusMap[user?.profileData.status || 'unknown']}
            </div>

            <div className={stylesProfile.fieldGroup}>
              <label className={stylesProfile.label}>Имя пользователя</label>
              <Controller
                name="username"
                control={control}
                rules={{ required: 'введите имя пользователя' }}
                render={({ field }) => (
                  <input
                    {...field}
                    className={stylesProfile.input}
                    type="text"
                  />
                )}
              />
              {errors.username && (
                <span className={stylesProfile.error}>
                  {errors.username.message}
                </span>
              )}
            </div>

            <div className={stylesProfile.nameRow}>
              <div className={stylesProfile.fieldGroup}>
                <label className={stylesProfile.label}>Имя</label>
                <Controller
                  name="firstName"
                  control={control}
                  rules={{ required: 'Введите ваше имя' }}
                  render={({ field }) => (
                    <input
                      {...field}
                      className={stylesProfile.input}
                      type="text"
                    />
                  )}
                />
                {errors.firstName && (
                  <span className={stylesProfile.error}>
                    {errors.firstName.message}
                  </span>
                )}
              </div>

              <div className={stylesProfile.fieldGroup}>
                <label className={stylesProfile.label}>Фамилия</label>
                <Controller
                  name="lastName"
                  control={control}
                  rules={{ required: 'Введите вашу фимилию' }}
                  render={({ field }) => (
                    <input
                      {...field}
                      className={stylesProfile.input}
                      type="text"
                    />
                  )}
                />
                {errors.lastName && (
                  <span className={stylesProfile.error}>
                    {errors.lastName.message}
                  </span>
                )}
              </div>

              <div className={stylesProfile.fieldGroup}>
                <label className={stylesProfile.label}>Отчество</label>
                <Controller
                  name="fatherName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className={stylesProfile.input}
                      type="text"
                    />
                  )}
                />
              </div>
            </div>

            <div className={stylesProfile.fieldGroup}>
              <label className={stylesProfile.label}>
                Почта
                {(!user?.profileData.emailConfirmed ||
                  user?.profileData.email !== email) && (
                  <button
                    type="button"
                    onClick={handleConfirmEmail}
                    className={stylesProfile.confirmButton}
                  >
                    Подтвердить
                  </button>
                )}
              </label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Введите вашу почту',
                  // pattern: {
                  //   value: /^\S+@\S+$/i,
                  //   message: 'Некорректный формат!',
                  // },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    className={stylesProfile.input}
                    type="email"
                  />
                )}
              />
              {errors.email && (
                <span className={stylesProfile.error}>
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className={stylesProfile.fieldGroup}>
              <label className={stylesProfile.label}>
                Номер телефона
                {(!user?.profileData.phoneConfirmed ||
                  user?.profileData.phone !== phone) && (
                  <button
                    type="button"
                    onClick={handleConfirmPhone}
                    className={stylesProfile.confirmButton}
                  >
                    Подтвердить
                  </button>
                )}
              </label>
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: 'Введите номер телефона',
                  pattern: {
                    value: /^(\+7\d{10}|8\d{10})$/,
                    message: 'Некорректный формат!',
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    className={stylesProfile.input}
                    type="tel"
                  />
                )}
              />
              {errors.phone && (
                <span className={stylesProfile.error}>
                  {errors.phone.message}
                </span>
              )}
            </div>

            <div className={stylesProfile.fieldGroup}>
              <label className={stylesProfile.label}>Страна</label>
              <Controller
                name="country"
                control={control}
                rules={{ required: 'Введите страну' }}
                render={({ field }) => (
                  <input
                    {...field}
                    className={stylesProfile.input}
                    type="text"
                  />
                )}
              />
              {errors.country && (
                <span className={stylesProfile.error}>
                  {errors.country.message}
                </span>
              )}
            </div>

            <div className={stylesProfile.fieldGroup}>
              <label className={stylesProfile.label}>Город</label>
              <Controller
                name="city"
                control={control}
                rules={{ required: 'Введите город' }}
                render={({ field }) => (
                  <input
                    {...field}
                    className={stylesProfile.input}
                    type="text"
                  />
                )}
              />
              {errors.city && (
                <span className={stylesProfile.error}>
                  {errors.city.message}
                </span>
              )}
            </div>

            <div className={stylesProfile.fieldGroup}>
              <label className={stylesProfile.label}>Компания</label>
              <Controller
                name="company"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    className={stylesProfile.input}
                    type="text"
                    value={field.value || ''}
                    placeholder="Нет"
                  />
                )}
              />
            </div>

            {company && (
              <>
                <div className={stylesProfile.fieldGroup}>
                  <label className={stylesProfile.label}>
                    Количество работников
                  </label>
                  <Controller
                    name="employeeCount"
                    control={control}
                    rules={
                      company !== ''
                        ? { required: 'Пожалуйста, выберите один из вариантов' }
                        : undefined
                    }
                    render={({ field }) => (
                      <select
                        {...field}
                        className={stylesProfile.select}
                        value={field.value || '<10'}
                      >
                        <option value="<10">менее 10</option>
                        <option value="11-30">от 11 до 30</option>
                        <option value="30-100">от 30 до 100</option>
                        <option value=">100">более 100</option>
                      </select>
                    )}
                  />
                  {errors.employeeCount && (
                    <span className={stylesProfile.error}>
                      {errors.employeeCount.message}
                    </span>
                  )}
                </div>

                <div className={stylesProfile.fieldGroup}>
                  <label className={stylesProfile.label}>Должность</label>
                  <Controller
                    name="jobPosition"
                    control={control}
                    rules={
                      company !== ''
                        ? { required: 'Пожалуйста, ведите вашу должность' }
                        : undefined
                    }
                    render={({ field }) => (
                      <input
                        {...field}
                        className={stylesProfile.input}
                        type="text"
                        value={field.value || ''}
                      />
                    )}
                  />
                  {errors.jobPosition && (
                    <span className={stylesProfile.error}>
                      {errors.jobPosition.message}
                    </span>
                  )}
                </div>
              </>
            )}

            <div className={stylesProfile.fieldGroup}>
              <label className={stylesProfile.label}>Цель использования</label>
              <Controller
                name="usePurpose"
                control={control}
                rules={{ required: 'Пожалуйста, выберите один из вариантов' }}
                render={({ field }) => (
                  <select {...field} className={stylesProfile.select}>
                    <option value="personal">Личное использование</option>
                    <option value="testPersonal">
                      Тестирование собстенных разработок
                    </option>
                    <option value="testCompany">
                      Тестирование разработок компании
                    </option>
                    <option value="testJob">
                      Тестирование чужих разработок по договору
                    </option>
                  </select>
                )}
              />
              {errors.usePurpose && (
                <span className={stylesProfile.error}>
                  {errors.usePurpose.message}
                </span>
              )}
            </div>
            <div className={stylesProfile.actions}>
              <button
                type="submit"
                disabled={isSubmitting}
                className={stylesGeneral.submitButton}
              >
                {isSubmitting ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>

          <div className={stylesProfile.teamsSection}>
            <h3 className={stylesProfile.sectionTitle}>Ваши команды</h3>
            {user?.profileData.teams && user.profileData.teams.length > 0 ? (
              <table className={stylesProfile.teamsTable}>
                <thead>
                  <tr>
                    <th>Имя команды</th>
                    <th>Ваша роль</th>
                  </tr>
                </thead>
                <tbody>
                  {user.profileData.teams.map((team) => (
                    <tr key={team.id}>
                      <td>{team.name}</td>
                      <td>
                        {' '}
                        {team.role === 2 ? (
                          <Link
                            to={`${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.ADMIN}`}
                          >
                            {userRoleMap[team.role]}
                          </Link>
                        ) : (
                          userRoleMap[team.role]
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className={stylesProfile.noTeams}>
                У вас нет команд! {user ? 'true' : 'false'}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
