import React from 'react'
import { MOCK_MODE, MOCK_CODE } from '@constants/'
import { MOCK_PASSWORD, mockUsers } from '../mock/mockData'

export const MockInfo: React.FC = () => {
  if (!MOCK_MODE) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 10,
        left: 100,
        background: 'rgba(255, 255, 0, 0.9)',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '12px',
        zIndex: 1000,
        maxWidth: '300px',
      }}
    >
      <strong>🔧 Режим разработки</strong>
      <br />
      <strong>Тестовые пользователи:</strong>
      {mockUsers.map((user) => (
        <div key={user.id} style={{ marginTop: '5px' }}>
          <div>Email: {user.profileData.email}</div>
          <div>Пароль: {MOCK_PASSWORD}</div>
          <div>Код подтверждения: {MOCK_CODE}</div>
          <hr style={{ margin: '5px 0' }} />
        </div>
      ))}
    </div>
  )
}
