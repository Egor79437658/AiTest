import React from 'react'
import styles from './ProjectUsers.module.scss'
import { ProjectUser } from '@interfaces/'

interface ProjectUsersProps {
  users: ProjectUser[]
}

export const ProjectUsers: React.FC<ProjectUsersProps> = ({ users }) => {
  if (!users || users.length === 0) {
    return (
      <section className={styles.projectSection}>
        <h3>Пользователи в проекте</h3>
        <div className={styles.noUsers}>Нет пользователей в проекте</div>
      </section>
    )
  }

  return (
    <section className={styles.projectSection}>
      <h3>Пользователи в проекте</h3>
      <div className={styles.tableContainer}>
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>ФИО</th>
              <th>E-mail</th>
              <th>Роль</th>
              <th>Права пользователя в команде</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.permissions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
