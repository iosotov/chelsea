import { Provider } from 'react-redux'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { act, cleanup, fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import profile, { selectProfileById } from '../profileSlice'
import { JSDOM } from 'jsdom'
import { apiSlice } from '../api/apiSlice'
import auth, { setCredentials } from '../authSlice'
import task, { selectTaskByProfileId } from '../taskSlice'

import SolApi from '../api/SolApi'
import { taskApiSlice } from '../api/taskApiSlice'

// import { waitForApiCall } from './helper'

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    task,
    auth
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
})

const storeWrapper = Component => {
  return props => (
    <Provider store={store}>
      <Component {...props} />
    </Provider>
  )
}

beforeAll(async () => {
  // Set up a fake DOM environment with jsdom
  const { window } = new JSDOM('<!doctype html><html><body></body></html>')
  global.window = window
  global.document = window.document

  try {
    const res = await SolApi.TestAuth() // Call the TestAuth API

    const authData = {
      employeeId: 'test',
      token: res.data.token,
      permissions: []
    }
    SolApi.token = res.data.token
    store.dispatch(setCredentials(authData)) // Dispatch the setCredential action with the token
  } catch (error) {
    console.error('Error fetching test token:', error[0].data)
  }
})

afterAll(async () => {
  cleanup()
  store.dispatch(apiSlice.util.resetApiState())

  delete global.window
  delete global.document
})

test('task api', async () => {
  let _profileId = '9158384435'
  let _taskId = '3a02608d-d65d-4054-b7b2-e1c2b230aea4'

  const _profileTaskCreate = {
    profileId: _profileId,
    taskName: 'Welcome call 2',
    dueDate: '2023-01-30',
    assignedTo: 'b12557c2-3a35-4ce6-9e52-959c07e13ce5',
    assignType: 2
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _profileTaskUpdate = {
    profileId: _profileId,
    taskId: _taskId,
    taskName: 'Introductory Redux Update KKKKKK',
    dueDate: '2023-06-09',
    assignedTo: 'b12557c2-3a35-4ce6-9e52-959c07e13ce5',
    assignType: 2,
    status: 1,
    notes: 'updated redux'
  }

  // const a = {
  //   taskName: 'Introductory Call 2',
  //   dueDate: '2023-03-09',
  //   assignedTo: 'b12557c2-3a35-4ce6-9e52-959c07e13ce5',
  //   assignType: 2,
  //   status: 1,
  //   notes: '',
  //   taskId: '5444139b-acab-4ca6-a50e-ba406fba85b1'
  // }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const useGetTaskQueryMock = jest.spyOn(taskApiSlice, 'useGetTaskQuery')
  const useGetProfileTasksQueryMock = jest.spyOn(taskApiSlice, 'useGetProfileTasksQuery')

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const usePutUpdateTaskMutationMock = jest.spyOn(taskApiSlice, 'usePutUpdateTaskMutation')
  const usePutBulkUpdateTasksMutationMock = jest.spyOn(taskApiSlice, 'usePutBulkUpdateTasksMutation')

  const usePostCreateTaskMutationMock = jest.spyOn(taskApiSlice, 'usePostCreateTaskMutation')
  const usePostSearchTaskQueryMock = jest.spyOn(taskApiSlice, 'usePostSearchTaskQuery')
  const useDeleteTaskMutationMock = jest.spyOn(taskApiSlice, 'useDeleteTaskMutation')

  const ProfileWrapper = storeWrapper(({ profileId }) => {
    const {
      isLoading: profileIsLoading,
      isSuccess: profileIsSuccess,
      isFetching: profileIsFetching
    } = useGetProfileTasksQueryMock(profileId)

    const [createTask, { isLoading: createTaskLoading, isSuccess: createTaskSuccess }] = usePostCreateTaskMutationMock()

    async function handleCreateTask() {
      const data = await createTask(_profileTaskCreate).unwrap()
      console.log(data)
    }

    return (
      <>
        {/* ////////////////////////////////////////////////// */}

        <div>{profileIsLoading && 'profileIsLoading'}</div>

        <div>{profileIsFetching && 'profileIsFetching'}</div>

        <div>
          {profileIsFetching && 'profileIsFetching'}
          {profileIsSuccess && 'profileIsSuccess'}
        </div>

        {/* ////////////////////////////////////////////////// */}

        <div>{createTaskLoading && 'createTaskLoading'}</div>

        <div>{createTaskSuccess && 'createTaskSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <button onClick={handleCreateTask}>createTask</button>
      </>
    )
  })

  const TaskListWrapper = storeWrapper(({ taskId }) => {
    const {
      data,
      isLoading: tasksIsLoading,
      isSuccess: tasksIsSuccess,
      isFetching: tasksIsFetching
    } = usePostSearchTaskQueryMock({})

    console.log(data && data.filter(task => task.taskId === _taskId))

    const [deleteTask, { isLoading: deleteTaskLoading, isSuccess: deleteTaskSuccess }] = useDeleteTaskMutationMock()
    const [bulkUpdate, { isLoading: bulkUpdateLoading, isSuccess: bulkUpdateSuccess }] =
      usePutBulkUpdateTasksMutationMock()

    async function handleDeleteTask() {
      const data = await deleteTask(taskId).unwrap()
      console.log(data)
    }

    async function handleBulkUpdate() {
      const data = {
        taskIds: ['3a02608d-d65d-4054-b7b2-e1c2b230aea4', '4fe2b159-19b6-4223-a1e7-737b72c7371b'],
        status: 0,
        dueDate: '2023-07-04',
        notes: 'update Test',
        assignedTo: 'b12557c2-3a35-4ce6-9e52-959c07e13ce5',
        assignType: 2
      }
      const res = await bulkUpdate(data).unwrap()
      console.log(res)
    }

    return (
      <>
        {/* ////////////////////////////////////////////////// */}

        <div>{tasksIsLoading && 'tasksIsLoading'}</div>

        <div>{tasksIsFetching && 'tasksIsFetching'}</div>

        <div>
          {tasksIsFetching && 'tasksIsFetching'}
          {tasksIsSuccess && 'tasksIsSuccess'}
        </div>

        {/* ////////////////////////////////////////////////// */}

        <div>{deleteTaskLoading && 'deleteTaskLoading'}</div>

        <div>{deleteTaskSuccess && 'deleteTaskSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <div>{bulkUpdateLoading && 'bulkUpdateLoading'}</div>

        <div>{bulkUpdateSuccess && 'bulkUpdateSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <button onClick={handleBulkUpdate}>bulkUpdate</button>

        <button onClick={handleDeleteTask}>deleteTask</button>
      </>
    )
  })

  // const TaskWrapper = storeWrapper(({ taskId }) => {
  //   const {
  //     data,
  //     isLoading: taskIsLoading,
  //     isSuccess: taskIsSuccess,
  //     isFetching: taskIsFetching
  //   } = useGetTaskQueryMock(taskId)

  //   console.log(data)

  //   const [updateTask, { isLoading: updateTaskLoading, isSuccess: updateTaskSuccess }] = usePutUpdateTaskMutationMock()

  //   async function handleUpdateTask() {
  //     const data = await updateTask(_profileTaskUpdate).unwrap()
  //     console.log(data)
  //   }

  //   return (
  //     <>
  //       {/* ////////////////////////////////////////////////// */}

  //       <div>{taskIsLoading && 'taskIsLoading'}</div>

  //       <div>{taskIsFetching && 'taskIsFetching'}</div>

  //       <div>
  //         {taskIsFetching && 'taskIsFetching'}
  //         {taskIsSuccess && 'taskIsSuccess'}
  //       </div>

  //       {/* ////////////////////////////////////////////////// */}

  //       <div>{updateTaskLoading && 'updateTaskLoading'}</div>

  //       <div>{updateTaskSuccess && 'updateTaskSuccess'}</div>

  //       {/* ////////////////////////////////////////////////// */}

  //       <button onClick={handleUpdateTask}>updateTask</button>
  //     </>
  //   )
  // })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const { getByText: profile } = render(<ProfileWrapper profileId={_profileId} />)

  // const { getByText: task } = render(<TaskWrapper taskId={_taskId} />)
  const { getByText: tasks } = render(<TaskListWrapper taskId={_taskId} />)

  await waitFor(() => expect(profile('profileIsLoading')).toBeInTheDocument(), { timeout: 5000 })

  // await waitFor(() => expect(task('taskIsLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(tasks('tasksIsLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(profile('profileIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  // await waitFor(() => expect(task('taskIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(tasks('tasksIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  let state = store.getState()

  // access tags used for cache management
  // let taskTags = state[apiSlice.reducerPath].provided.TASK

  let profileTasks = selectTaskByProfileId(state, _profileId)

  // console.log(taskTags)
  console.log(profileTasks)

  let button = tasks('deleteTask')
  fireEvent.click(button)

  await waitFor(() => expect(tasks('deleteTaskLoading')).toBeInTheDocument(), { timeout: 3000 })
  await waitFor(() => expect(tasks('deleteTaskSuccess')).toBeInTheDocument(), { timeout: 3000 })
  await waitFor(() => expect(tasks('tasksIsFetching')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(profile('profileIsFetching')).toBeInTheDocument(), { timeout: 5000 })

  // await waitFor(() => expect(task('taskIsFetching')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(tasks('tasksIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(profile('profileIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  // await waitFor(() => expect(task('taskIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  state = store.getState()

  // taskTags = state[apiSlice.reducerPath].provided.TASK

  profileTasks = selectTaskByProfileId(state, _profileId)

  // console.log(taskTags)
  console.log(profileTasks)
}, 10000)
