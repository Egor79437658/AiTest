import { Breadcrumbs, MySwiper } from '@components/'
import { PAGE_ENDPOINTS } from '@constants/'
import { useProject, useTestCase } from '@contexts/'
import { testCaseStatusMap } from '@interfaces/'
import { useHeaderStore } from '@stores/'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SwiperSlide } from 'swiper/react'
import styles from './ProjectTestCases.module.scss'
import { SyncLoader } from 'react-spinners'

export const ProjectTestCases: React.FC = () => {
  const { project } = useProject()
  const {
    allTestCases: testCases,
    loadAllTestCases,
    isLoading,
    error,
  } = useTestCase()
  const { setHeaderContent } = useHeaderStore()
  const [caseIds, setCaseIds] = useState<number[]>([])
  const navigator = useNavigate()
  const [swiperRefs, setSwiperRefs] = useState<
    {
      refactor: React.RefObject<HTMLInputElement>
      delete: React.RefObject<HTMLInputElement>
    }[]
  >([])
  const deleteRefs = useRef<HTMLInputElement[]>([])
  const refactorRefs = useRef<HTMLInputElement[]>([])

  const handleRefactor = () => {
    if (!refactorRefs.current) return

    const ids = []
    for (let i = 0; i < refactorRefs.current.length; i++) {
      if (refactorRefs.current[i] && refactorRefs.current[i].checked) {
        ids.push(caseIds[i])
      }
    }
    console.log(ids)
  }

  const handleDelete = () => {
    if (!deleteRefs.current) return

    const ids = []
    for (let i = 0; i < deleteRefs.current.length; i++) {
      if (deleteRefs.current[i] && deleteRefs.current[i].checked) {
        ids.push(caseIds[i])
      }
    }
    console.log(ids)
  }

  const handleChangeCase = (id: number) => {
    console.log(id)
    navigator(window.location.href + `/${id}`)
  }
  const handleOpenHistory = (id: number) => {
    console.log(id)
  }

  useEffect(() => {
    if (project) {
      setHeaderContent(
        <Breadcrumbs
          items={[
            {
              text: 'Проекты',
              link: `${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.HOME}`,
            },
            {
              text: project.name,
              link: `${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.PROJECT}/${project.id}`,
            },
            { text: 'Тест-кейсы' },
          ]}
        />
      )
    }
  }, [project, setHeaderContent])

  useEffect(() => {
    if (project) {
      try {
        loadAllTestCases(project.id)
      } catch (e: any) {
        console.log('failed to load test-cases')
      }
    }
  }, [project])

  useEffect(() => {
    const ids = Array.from(new Set(testCases.map((el) => el.id)))
    setCaseIds(ids)
    setSwiperRefs(new Array(ids.length))
  }, [testCases])

  if (error) {
    return (
      <div>
        Прозошла ошибка: {error} <br />
        <Link to="/">Вернуться к списку проектов</Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <>
        <div>Загрузка тест-кейсов</div>
        <SyncLoader color="#000000" />
      </>
    )
  }

  return (
    <div className={styles.pageContainer}>
      {caseIds.map((id, index) => (
        <MySwiper key={id} slidesPerView={1} className={styles.swiper}>
          {testCases
            .filter((el) => el.id === id)
            .sort(
              (a, b) =>
                new Date(b.creationDate).getTime() -
                new Date(a.creationDate).getTime()
            )
            .map((el, index) => (
              <SwiperSlide
                key={`${id}-${el.version}`}
                className={styles.swiperSlide}
                style={{ width: 'auto' }}
              >
                <h3>{el.name}</h3>
                {index !== 0 && (
                  <h3 className={styles.warning}>Устаревшая версия!</h3>
                )}
                <div className={styles.testCaseSection}>
                  <label htmlFor="checkbox">Checkbox: </label>
                  <span>{el.flag ? 'true' : 'false'}</span>
                </div>

                <div className={styles.testCaseSection}>
                  <label htmlFor="id">IDT: </label>
                  <span>{el.id}</span>
                </div>

                <div className={styles.testCaseSection}>
                  <label htmlFor="status">Статус: </label>
                  <span>{testCaseStatusMap[el.status]}</span>
                </div>

                <div className={styles.testCaseSection}>
                  <label htmlFor="positive">Позитвный: </label>
                  <span>{el.positive ? 'Да' : 'Нет'}</span>
                </div>

                <div className={styles.testCaseSection}>
                  <label htmlFor="version">Версия: </label>
                  <span>{el.version}</span>
                </div>

                <div className={styles.testCaseSection}>
                  <label htmlFor="scriptIds">Скрипты: </label>
                  <span>{el.scriptIds.map((val) => val.name).join(' ')}</span>
                </div>

                <div className={styles.testCaseSection}>
                  <label htmlFor="precondition">Предусловие: </label>
                  <span>{el.precondition}</span>
                </div>

                <div className={styles.testCaseSection}>
                  <label htmlFor="testCases">
                    Тест-кейсы, где используется:{' '}
                  </label>
                  <span>{el.testCases.map((val) => val.name).join(' ')}</span>
                </div>

                <div className={styles.testCaseSection}>
                  <label htmlFor="username">Владелец: </label>
                  <span>{el.owner.username}</span>
                </div>

                <div className={styles.testCaseSection}>
                  <label htmlFor="creationDate">Дата создания: </label>
                  <span>{el.creationDate.toLocaleDateString()}</span>
                </div>

                <div className={styles.testCaseSection}>
                  <label htmlFor="usedInTestPlans">Входит в тест-план?: </label>
                  <span>{el.usedInTestPlans ? 'Да' : 'Нет'}</span>
                </div>

                {/* <h3>Тест-планы</h3>
                <div>
                  {el.testPlans.length > 0 ? (
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Название</th>
                          <th>Дата</th>
                        </tr>
                      </thead>
                      <tbody>
                        {el.testPlans.map((row) => (
                          <tr
                            key={row.id}
                            onClick={() =>
                              navigator(
                                `${window.location.href.split('/' + PAGE_ENDPOINTS.PROJECT_PARTS.TEST_CASE)[0]}/${PAGE_ENDPOINTS.PROJECT_PARTS.TEST_PLAN}/${id}`
                              )
                            }
                          >
                            <td>{row.name}</td>
                            <td>{row.date.toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className={styles.noTable}>У вас нет команд!</p>
                  )}
                </div> */}
              </SwiperSlide>
            ))}
          <div className={styles.swiperFooter}>
            <div className={styles.swiperFlags}>
              <div>
                <input
                  type="checkbox"
                  id={`delete-${id}`}
                  ref={(el) => {
                    if (el) {
                      deleteRefs.current[index] = el
                    }
                  }}
                />
                <label htmlFor={`delete-${id}`}>Отметить для удаления</label>
              </div>

              <div>
                <input
                  type="checkbox"
                  id={`refactor-${id}`}
                  ref={(el) => {
                    if (el) {
                      refactorRefs.current[index] = el
                    }
                  }}
                />
                <label htmlFor={`refactor-${id}`}>
                  Отметить для рефакторинга
                </label>
              </div>
            </div>
            <div className={styles.swiperBtns}>
              <button
                className={styles.actionButton}
                onClick={() => handleChangeCase(id)}
              >
                Редактировать
              </button>
              <button
                className={styles.actionButton}
                onClick={() => handleOpenHistory(id)}
              >
                История изменений
              </button>
            </div>
          </div>
        </MySwiper>
      ))}
      <div className={styles.pageFooter}>
        <button className={styles.actionButton} onClick={() => handleDelete()}>
          Удалить отмеченные
        </button>

        <button
          className={styles.actionButton}
          onClick={() => handleRefactor()}
        >
          перейти к рефакторингу отмеченных
        </button>
      </div>
    </div>
  )
}
