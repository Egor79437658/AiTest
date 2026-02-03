import { useAuth, useUser } from '@contexts/'
import type React from 'react'
import stylesFinance from '../styles/FinanceTab.module.scss'
import stylesGeneral from '../styles/Account.module.scss'
import { useEffect, useState } from 'react'
import { useHeaderStore } from '@stores/'
import { Breadcrumbs } from '@components/'
import { SyncLoader } from 'react-spinners'

const statusMap = {
  active: 'Активен',
  blocked: 'Заблокирован',
  deleted: 'Удалён',
}

const [min, max] = [0, 9999999999]

export const FinanceTab: React.FC = () => {
  const { user, isLoading } = useUser()
  const [hidden, setHidden] = useState(true)
  const [balanceAddintion, setBalanceAddition] = useState(0)
  const [error, setError] = useState('')
  const { setHeaderContent } = useHeaderStore()

  useEffect(() => {
    if (user?.profileData.username) {
      setHeaderContent(
        <Breadcrumbs
          items={[{ text: user.profileData.username }, { text: 'финансы' }]}
        />
      )
    }
  }, [setHeaderContent, user?.profileData.username])
  const changeBalance = (val: number) => {
    console.log('change balance: +', val)
    if (user) {
      user.financeData.balance += val
    }
    return true
    // вернуть false если неудачно
  }

  // useEffect(() => {
  //   console.log("sdfsdfsdg")
  //   console.log(user)
  // }, [])

  function handleOnChange(newVal: string) {
    if (newVal == '') {
      setBalanceAddition(0)
      return
    }
    const num = Number(newVal)
    if (Number.isNaN(num)) {
      return
    } else {
      setError('')
      if (num > max) {
        setBalanceAddition(max)
        return
      } else if (num < min) {
        setBalanceAddition(min)
      } else {
        setBalanceAddition(Math.round(num * 100) / 100)
      }
    }
  }

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
      <div className={stylesFinance.financeTab}>
        <div className={stylesFinance.mainDiv}>
          <div className={stylesFinance.balanceDiv}>
            <label htmlFor="balance">Баланс:</label>
            <span>{user?.financeData.balance} руб.</span>
          </div>
          <div className={stylesFinance.tableDiv}>
            <table>
              <thead>
                <tr>
                  <th>План 1</th>
                  <th>План 2</th>
                  <th>План 3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <ul>
                      <li>fabvfd 1</li>
                      <li>fabvfd 2</li>
                      <li>fabvfd 3</li>
                    </ul>
                  </td>
                  <td>
                    <ul>
                      <li>fabvfd 1</li>
                      <li>fabvfd 2</li>
                      <li>fabvfd 3</li>
                    </ul>
                  </td>
                  <td>
                    <ul>
                      <li>fabvfd 1</li>
                      <li>fabvfd 2</li>
                      <li>fabvfd 3</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              type="button"
              className={stylesGeneral.submitButton}
              onClick={(e) => {
                console.log('to plans')
                e.currentTarget.blur()
              }}
            >
              Выбрать свой план
            </button>
          </div>
          <div className={stylesFinance.changeBalance}>
            <button
              type="button"
              className={stylesGeneral.submitButton}
              onClick={(e) => {
                if (hidden) {
                  setHidden(!hidden)
                } else {
                  if (changeBalance(balanceAddintion)) {
                    setHidden(true)
                  }
                }
                e.currentTarget.blur()
              }}
            >
              Пополнить баланс
            </button>

            <div
              className={`${stylesFinance.balanceInputDiv} ${hidden ? stylesFinance.hidden : ''}`}
            >
              <label htmlFor="balanceInput">Введите сумму:</label>
              <input
                type="number"
                min={min}
                max={max}
                value={balanceAddintion}
                onChange={(e) => handleOnChange(e.currentTarget.value)}
              />
              <span className={stylesFinance.error}>{error}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
