import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ProjectSettings.module.scss';
import { mockApiService } from '../../../../services/mockApiService';
import { ProjectContext } from '../../../../contexts/Project/ProjectContext.tsx'; // Предполагаемый контекст

interface ProjectFormData {
  name: string;
  url: string;
  description: string;
}

interface DataPoolItem {
  id: string;
  key: string;
  value: string;
}

enum UserRole {
  IT_LEADER = 0,
  PROJECT_ADMIN = 1,
  ANALYST = 2,
  TESTER = 3,
  AUTOMATOR = 4,
  USER = 5
}

interface RoleConfig {
  label: string;
  permissions: string[];
  description: string;
}

const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  [UserRole.IT_LEADER]: {
    label: 'ИТ-лидер',
    permissions: [
      'Создание тест-кейсов',
      'Редактирование тест-кейсов',
      'Просмотр тест-кейсов',
      'Создание скриптов',
      'Создание прогонов',
      'Запуск скриптов',
      'Управление проектом',
      'Управление командой'
    ],
    description: 'Полный доступ ко всем функциям проекта'
  },
  [UserRole.PROJECT_ADMIN]: {
    label: 'Админ проекта',
    permissions: [
      'Создание тест-кейсов',
      'Редактирование тест-кейсов',
      'Просмотр тест-кейсов',
      'Создание скриптов',
      'Создание прогонов',
      'Запуск скриптов',
      'Управление проектом'
    ],
    description: 'Почти полный доступ, включая управление проектом'
  },
  [UserRole.ANALYST]: {
    label: 'Аналитик',
    permissions: [
      'Создание тест-кейсов',
      'Редактирование тест-кейсов',
      'Просмотр тест-кейсов'
    ],
    description: 'Работа с тест-кейсами'
  },
  [UserRole.TESTER]: {
    label: 'Тестировщик',
    permissions: [
      'Создание тест-кейсов',
      'Просмотр тест-кейсов',
      'Запуск скриптов'
    ],
    description: 'Создание ТК и запуск автоматических тестов'
  },
  [UserRole.AUTOMATOR]: {
    label: 'Автоматизатор',
    permissions: [
      'Создание скриптов',
      'Запуск скриптов'
    ],
    description: 'Работа с автоматизированными тестами'
  },
  [UserRole.USER]: {
    label: 'Пользователь',
    permissions: [
      'Просмотр тест-кейсов'
    ],
    description: 'Только просмотр информации'
  }
};

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
const MAX_DATAPOOL_ROWS = 1000;

export const ProjectSettings: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, setProjects } = useContext(ProjectContext); // Используем контекст для управления проектами
  
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    watch
  } = useForm<ProjectFormData>({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      url: '',
      description: ''
    }
  });

  const [dataPoolMode, setDataPoolMode] = useState<'upload' | 'manual'>('manual');
  const [dataPool, setDataPool] = useState<DataPoolItem[]>([
    { id: '1', key: '', value: '' }
  ]);
  const [project, setProject] = useState<any>(null);
  const [projectUsers, setProjectUsers] = useState<any[]>([]);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
  } | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [newUser, setNewUser] = useState({
    email: '',
    role: UserRole.USER as UserRole
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const user = await mockApiService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error loading current user:', error);
      }
    };
    
    loadCurrentUser();
  }, []);

  useEffect(() => {
    const loadProject = async () => {
      if (projectId && currentUser) {
        setIsLoading(true);
        
        try {
          const foundProject = await mockApiService.getProject(parseInt(projectId));
          
          if (foundProject) {
            setProject(foundProject);
            setProjectUsers(foundProject.users || []);
            
            reset({
              name: foundProject.name || '',
              url: foundProject.url || '',
              description: foundProject.description || ''
            });
            
            const currentUserInProject = foundProject.users?.find(
              (u: any) => u.email === currentUser.profileData.email
            );
            
            if (currentUserInProject) {
              setIsAdmin([UserRole.IT_LEADER, UserRole.PROJECT_ADMIN].includes(currentUserInProject.role));
            } else {
              setIsAdmin(foundProject.createdBy === currentUser.id);
            }
            
            const savedDataPool = localStorage.getItem(`project_${projectId}_datapool`);
            if (savedDataPool) {
              try {
                const parsedData = JSON.parse(savedDataPool);
                if (Array.isArray(parsedData) && parsedData.length > 0) {
                  setDataPool(parsedData.map((item: any, index: number) => ({
                    id: String(index + 1),
                    key: item.key || '',
                    value: item.value || ''
                  })));
                }
              } catch (error) {
                console.error('Error parsing data pool:', error);
              }
            }
          } else {
            showNotification('error', 'Проект не найден');
          }
        } catch (error) {
          console.error('Error loading project:', error);
          showNotification('error', 'Ошибка загрузки проекта');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadProject();
  }, [projectId, reset, currentUser]);

  const showNotification = useCallback((type: 'success' | 'error' | 'warning', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const handleSaveProject = async (data: ProjectFormData) => {
    if (!project || !projectId) return;

    try {
      setIsLoading(true);

      if (!data.name.trim()) {
        showNotification('error', 'Название проекта обязательно');
        return;
      }

      if (data.name.length < 3 || data.name.length > 255) {
        showNotification('error', 'Название должно быть от 3 до 255 символов');
        return;
      }

      if (!URL_REGEX.test(data.url)) {
        showNotification('error', 'Введите корректный URL');
        return;
      }

      const updateData = {
        name: data.name,
        url: data.url,
        description: data.description,
        updatedAt: new Date()
      };

      const updatedProject = await mockApiService.updateProject(parseInt(projectId), updateData);
      setProject(updatedProject);
      
      // Обновляем проект в глобальном состоянии
      if (setProjects) {
        setProjects(prev => prev.map(p => 
          p.id === parseInt(projectId) ? { ...p, ...updateData } : p
        ));
      }

      const validDataPool = dataPool
        .filter(item => item.key.trim() && item.value.trim())
        .map(item => ({
          key: item.key.trim(),
          value: item.value.trim()
        }));

      localStorage.setItem(`project_${project.id}_datapool`, JSON.stringify(validDataPool));

      showNotification('success', 'Настройки проекта успешно сохранены');
    } catch (error) {
      showNotification('error', 'Ошибка при сохранении настроек');
      console.error('Save project error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!project || !projectId) return;

    try {
      if (deleteConfirm !== project.name) {
        showNotification('error', `Введите "${project.name}" для подтверждения`);
        return;
      }

      await mockApiService.deleteProject(parseInt(projectId));
      localStorage.removeItem(`project_${project.id}_datapool`);
      
      // Удаляем проект из глобального состояния
      if (setProjects) {
        setProjects(prev => prev.filter(p => p.id !== parseInt(projectId)));
      }

      showNotification('success', 'Проект успешно удален');

      setTimeout(() => {
        navigate('/app/home');
      }, 1500);
    } catch (error) {
      showNotification('error', 'Ошибка при удалении проекта');
      console.error('Delete project error:', error);
    }
  };

  const handleAddDataPoolRow = () => {
    if (dataPool.length >= MAX_DATAPOOL_ROWS) {
      showNotification('error', `Максимальное количество записей - ${MAX_DATAPOOL_ROWS}`);
      return;
    }

    setDataPool([...dataPool, {
      id: Date.now().toString(),
      key: '',
      value: ''
    }]);
  };

  const handleUpdateDataPoolItem = (id: string, field: 'key' | 'value', value: string) => {
    setDataPool(dataPool.map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value };

        if (field === 'key' && value.trim()) {
          const duplicate = dataPool.find(i => i.id !== id && i.key === value);
          if (duplicate) {
            showNotification('error', `Ключ "${value}" уже существует`);
            return item;
          }
        }

        if (field === 'key' && value && !/^[a-zA-Z0-9_]+$/.test(value)) {
          showNotification('error', 'Ключ может содержать только латинские буквы, цифры и подчеркивания');
          return item;
        }

        return newItem;
      }
      return item;
    }));
  };

  const handleRemoveDataPoolItem = (id: string) => {
    if (dataPool.length <= 1) {
      showNotification('error', 'Должна остаться хотя бы одна запись');
      return;
    }

    setDataPool(dataPool.filter(item => item.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showNotification('error', 'Файл слишком большой (максимум 10 МБ)');
      return;
    }

    const validExtensions = ['.csv', '.xlsx', '.xls', '.json'];
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(extension)) {
      showNotification('error', 'Неподдерживаемый формат файла');
      return;
    }

    setUploadedFile(file);
    
    setTimeout(() => {
      const sampleData = [
        { id: 'f1', key: 'username', value: 'test_user' },
        { id: 'f2', key: 'password', value: 'test_password' },
        { id: 'f3', key: 'email', value: 'test@example.com' }
      ];
      setDataPool(sampleData);
      showNotification('success', 'Файл успешно загружен и обработан');
    }, 1000);
  };

  const handleDownloadDataPool = () => {
    const validData = dataPool.filter(item => item.key.trim() && item.value.trim());
    
    if (validData.length === 0) {
      showNotification('error', 'Нет данных для скачивания');
      return;
    }

    const csvContent = validData
      .map(item => `${item.key},${item.value}`)
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `datapool_${project?.name || 'project'}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('success', 'Файл успешно скачан');
  };

  const handleAddUser = async () => {
    if (!project || !projectId) return;

    if (!EMAIL_REGEX.test(newUser.email)) {
      showNotification('error', 'Введите корректный email адрес');
      return;
    }

    const existingUser = projectUsers.find(user => user.email === newUser.email);
    if (existingUser) {
      showNotification('error', 'Пользователь с таким email уже в проекте');
      return;
    }

    try {
      const allUsers = await mockApiService.getProjectUsers(parseInt(projectId));
      const userExistsInSystem = allUsers.find((u: any) => u.email === newUser.email);
      
      let newUserData;
      
      if (userExistsInSystem) {
        newUserData = {
          ...userExistsInSystem,
          role: newUser.role,
          permissions: JSON.stringify(ROLE_CONFIG[newUser.role].permissions)
        };
      } else {
        newUserData = {
          id: Date.now(),
          firstName: 'Новый',
          lastName: 'Пользователь',
          fatherName: null,
          email: newUser.email,
          role: newUser.role,
          permissions: JSON.stringify(ROLE_CONFIG[newUser.role].permissions)
        };
      }

      const updatedUsers = [...projectUsers, newUserData];
      setProjectUsers(updatedUsers);
      
      const updatedProject = await mockApiService.updateProject(parseInt(projectId), {
        users: updatedUsers
      });
      
      setProject(updatedProject);
      
      // Обновляем проект в глобальном состоянии
      if (setProjects) {
        setProjects(prev => prev.map(p => 
          p.id === parseInt(projectId) ? { ...p, users: updatedUsers } : p
        ));
      }

      setShowAddUserModal(false);
      setNewUser({ email: '', role: UserRole.USER });
      showNotification('success', `Пользователь ${newUser.email} добавлен в проект`);
    } catch (error) {
      showNotification('error', 'Ошибка при добавлении пользователя');
      console.error('Add user error:', error);
    }
  };

  const handleRemoveUser = async (userId: number) => {
    if (!project || !projectId) return;

    const userToRemove = projectUsers.find(user => user.id === userId);
    if (!userToRemove) return;

    if (!window.confirm(`Вы уверены, что хотите удалить ${userToRemove.firstName} ${userToRemove.lastName} из проекта?`)) {
      return;
    }

    try {
      const updatedUsers = projectUsers.filter(user => user.id !== userId);
      setProjectUsers(updatedUsers);
      
      const updatedProject = await mockApiService.updateProject(parseInt(projectId), {
        users: updatedUsers
      });
      
      setProject(updatedProject);
      
      // Обновляем проект в глобальном состоянии
      if (setProjects) {
        setProjects(prev => prev.map(p => 
          p.id === parseInt(projectId) ? { ...p, users: updatedUsers } : p
        ));
      }

      showNotification('success', 'Пользователь удален из проекта');
    } catch (error) {
      showNotification('error', 'Ошибка при удалении пользователя');
      console.error('Remove user error:', error);
    }
  };

  const nameLength = watch('name')?.length || 0;
  const descriptionLength = watch('description')?.length || 0;

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className={styles.projectSettings}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Проект не найден</h2>
          <p style={{ 
            fontFamily: '"Roboto for Learning", sans-serif', 
            color: '#556773',
            marginBottom: '20px'
          }}>
            Проект с ID {projectId} не существует или был удален
          </p>
          <button
            type="button"
            onClick={() => navigate('/app/home')}
            className={styles.secondaryButton}
          >
            Вернуться к списку проектов
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className={styles.projectSettings}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Доступ запрещен</h2>
          <p style={{ 
            fontFamily: '"Roboto for Learning", sans-serif', 
            color: '#556773',
            marginBottom: '20px'
          }}>
            У вас нет прав для доступа к настройкам проекта
          </p>
          <button
            type="button"
            onClick={() => navigate(`/app/project/${projectId}`)}
            className={styles.secondaryButton}
          >
            Вернуться к проекту
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.projectSettings}>
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      <div className={styles.breadcrumb}>
        <span className={styles.breadcrumbItem}>
          ЯМП
        </span>
        <span className={styles.breadcrumbSeparator}>→</span>
        <span className={styles.breadcrumbItem}>
          {project?.name || 'Проект'}
        </span>
        <span className={styles.breadcrumbSeparator}>→</span>
        <span className={styles.breadcrumbItemActive}>
          Настройки проекта
        </span>
      </div>

      <form onSubmit={handleSubmit(handleSaveProject)}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Основная информация</h2>

          <div className={styles.formGroup}>
            <label htmlFor="projectName" className={styles.required}>
              Название проекта
            </label>
            <Controller
              name="name"
              control={control}
              rules={{
                required: 'Название проекта обязательно',
                minLength: { value: 3, message: 'Минимум 3 символа' },
                maxLength: { value: 255, message: 'Максимум 255 символов' }
              }}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    id="projectName"
                    type="text"
                    className={`${styles.input} ${errors.name ? styles.error : ''}`}
                    placeholder="Введите название проекта"
                    maxLength={255}
                  />
                  {errors.name && (
                    <div className={styles.errorMessage}>{errors.name.message}</div>
                  )}
                  <div className={`${styles.characterCounter} ${
                    nameLength < 3 ? styles.error : 
                    nameLength > 250 ? styles.warning : ''
                  }`}>
                    {nameLength}/255 символов
                  </div>
                </>
              )}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="projectUrl" className={styles.required}>
              URL проекта
            </label>
            <Controller
              name="url"
              control={control}
              rules={{
                required: 'URL проекта обязателен',
                pattern: {
                  value: URL_REGEX,
                  message: 'Введите корректный URL'
                }
              }}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    id="projectUrl"
                    type="text"
                    className={`${styles.input} ${errors.url ? styles.error : ''}`}
                    placeholder="https://example.com"
                  />
                  {errors.url && (
                    <div className={styles.errorMessage}>{errors.url.message}</div>
                  )}
                </>
              )}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="projectDescription">Описание проекта</label>
            <Controller
              name="description"
              control={control}
              rules={{
                maxLength: { value: 2000, message: 'Максимум 2000 символов' }
              }}
              render={({ field }) => (
                <>
                  <textarea
                    {...field}
                    id="projectDescription"
                    className={styles.textarea}
                    placeholder="Опишите проект..."
                    maxLength={2000}
                  />
                  <div className={`${styles.characterCounter} ${
                    descriptionLength > 1900 ? styles.warning : ''
                  }`}>
                    {descriptionLength}/2000 символов
                  </div>
                </>
              )}
            />
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>DataPool (Тестовые данные)</h2>

          <div className={styles.dataPoolModeSelector}>
            <button
              type="button"
              className={`${styles.modeButton} ${dataPoolMode === 'upload' ? styles.active : ''}`}
              onClick={() => {
                if (dataPool.some(item => item.key.trim() || item.value.trim())) {
                  if (window.confirm('При переключении режима несохраненные данные будут потеряны')) {
                    setDataPoolMode('upload');
                  }
                } else {
                  setDataPoolMode('upload');
                }
              }}
            >
              Загрузка из файла
            </button>
            <button
              type="button"
              className={`${styles.modeButton} ${dataPoolMode === 'manual' ? styles.active : ''}`}
              onClick={() => setDataPoolMode('manual')}
            >
              Ручной ввод
            </button>
          </div>

          {dataPoolMode === 'upload' ? (
            <div 
              className={styles.uploadArea}
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <input
                id="fileInput"
                type="file"
                onChange={handleFileUpload}
                accept=".csv,.xlsx,.xls,.json"
              />
              <div className={styles.uploadIcon}>📁</div>
              <div className={styles.uploadText}>
                Перетащите файл сюда или нажмите для выбора
              </div>
              <div className={styles.fileInfo}>
                Поддерживаемые форматы: CSV, Excel, JSON. Максимум 10 МБ
              </div>
              {uploadedFile && (
                <div style={{ marginTop: '16px', color: '#0E6073' }}>
                  Загружен файл: {uploadedFile.name}
                </div>
              )}
            </div>
          ) : (
            <>
              <table className={styles.dataPoolTable}>
                <thead>
                  <tr>
                    <th>Ключ (макс. 50 символов)</th>
                    <th>Значение (макс. 500 символов)</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {dataPool.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <input
                          type="text"
                          value={item.key}
                          onChange={(e) => handleUpdateDataPoolItem(item.id, 'key', e.target.value)}
                          className={styles.tableInput}
                          placeholder="login"
                          maxLength={50}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => handleUpdateDataPoolItem(item.id, 'value', e.target.value)}
                          className={styles.tableInput}
                          placeholder="password123"
                          maxLength={500}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleRemoveDataPoolItem(item.id)}
                          className={styles.dangerButton}
                          disabled={dataPool.length <= 1}
                          style={{ padding: '6px 12px', fontSize: '13px' }}
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className={styles.dataPoolActions}>
                <button
                  type="button"
                  onClick={handleAddDataPoolRow}
                  className={styles.secondaryButton}
                  disabled={dataPool.length >= MAX_DATAPOOL_ROWS}
                >
                  + Добавить строку
                </button>
                <button
                  type="button"
                  onClick={handleDownloadDataPool}
                  className={styles.secondaryButton}
                  disabled={!dataPool.some(item => item.key.trim() && item.value.trim())}
                >
                  Скачать CSV
                </button>
              </div>
            </>
          )}
        </div>

        <div className={styles.section}>
          <div className={styles.teamHeader}>
            <h2 className={styles.sectionTitle}>Команда проекта</h2>
            <button
              type="button"
              onClick={() => setShowAddUserModal(true)}
              className={styles.primaryButton}
            >
              + Добавить пользователя
            </button>
          </div>

          {projectUsers.length > 0 ? (
            <table className={styles.teamTable}>
              <thead>
                <tr>
                  <th>Пользователь</th>
                  <th>Email</th>
                  <th>Роль</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {projectUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>
                        {`${user.lastName} ${user.firstName} ${user.fatherName || ''}`.trim()}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <div className={styles.roleBadge}>
                        {ROLE_CONFIG[user.role as UserRole]?.label || 'Пользователь'}
                      </div>
                      <div className={styles.permissionsInfo}>
                        {ROLE_CONFIG[user.role as UserRole]?.description || ''}
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleRemoveUser(user.id)}
                        className={styles.dangerButton}
                        style={{ padding: '6px 12px', fontSize: '13px' }}
                        disabled={user.role === UserRole.IT_LEADER || user.id === project?.createdBy}
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>👥</div>
              <div>В проекте пока нет участников</div>
              <div style={{ marginTop: '8px', fontSize: '14px' }}>
                Добавьте первого пользователя, чтобы начать работу в команде
              </div>
            </div>
          )}
        </div>

        <div className={styles.actionsContainer}>
          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className={styles.primaryButton}
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
          
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className={styles.dangerButton}
          >
            Удалить проект
          </button>
        </div>
      </form>

      {showAddUserModal && (
        <div 
          className={styles.modalOverlay}
          onClick={() => setShowAddUserModal(false)}
        >
          <div 
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>Добавить пользователя</h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="userEmail" className={styles.required}>
                Email пользователя
              </label>
              <input
                id="userEmail"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className={styles.input}
                placeholder="user@example.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="userRole">Роль в проекте</label>
              <select
                id="userRole"
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: parseInt(e.target.value) as UserRole})}
                className={styles.select}
              >
                {Object.entries(ROLE_CONFIG).map(([value, config]) => (
                  <option key={value} value={value}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.permissionSummary}>
              <div className={styles.permissionTitle}>
                Права для роли "{ROLE_CONFIG[newUser.role]?.label}":
              </div>
              <ul className={styles.permissionList}>
                {ROLE_CONFIG[newUser.role]?.permissions.map((permission, index) => (
                  <li key={index}>• {permission}</li>
                ))}
              </ul>
            </div>

            <div className={styles.modalButtons}>
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className={styles.secondaryButton}
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleAddUser}
                disabled={!newUser.email || !EMAIL_REGEX.test(newUser.email)}
                className={styles.primaryButton}
              >
                Отправить приглашение
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div 
          className={styles.modalOverlay}
          onClick={() => {
            setShowDeleteModal(false);
            setDeleteConfirm('');
          }}
        >
          <div 
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>Подтверждение удаления проекта</h3>
            
            <div className={styles.modalSubtitle}>
              Вы собираетесь удалить проект <strong>{project?.name}</strong>. 
              Это действие <strong style={{ color: '#dc3545' }}>нельзя отменить</strong>.
            </div>

            <div className={styles.warningBlock}>
              <div className={styles.warningTitle}>
                ⚠️ Будут удалены все данные проекта:
              </div>
              <ul className={styles.warningList}>
                <li>Тест-кейсы</li>
                <li>Скрипты автоматизации</li>
                <li>Планы тестирования</li>
                <li>Отчеты</li>
                <li>История прогонов</li>
              </ul>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="deleteConfirm">
                Для подтверждения введите название проекта:
                <br />
                <strong style={{ color: '#0E6073' }}>{project?.name}</strong>
              </label>
              <input
                id="deleteConfirm"
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                className={styles.input}
                placeholder="Введите название проекта"
              />
            </div>
              
            <div className={styles.modalButtons}>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm('');
                }}
                className={styles.secondaryButton}
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleDeleteProject}
                disabled={deleteConfirm !== project?.name}
                className={styles.dangerButton}
              >
                Удалить проект
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );


  
};