// ** React Import
import { Dispatch, SetStateAction, useRef } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import interactionPlugin from '@fullcalendar/interaction'

// ** Types
type CalendarType = {
  tasks: TaskType[]
  direction: 'ltr' | 'rtl'
  calendarsColor: CalendarColors
  handleLeftSidebarToggle: () => void
  setSelectedTask: Dispatch<SetStateAction<string[]>>,
  handleAddTaskSidebarToggle: () => void,

}

enum CalendarColorsEnum {
  Open,
  Attempted,
  Completed
}

// ** Third Party Style Import
import 'bootstrap-icons/font/bootstrap-icons.css'
import { TaskType } from 'src/store/api/taskApiSlice'
import { CalendarColors } from 'src/types/apps/calendarTypes'

export const blankEvent = {
  id: '',
  title: '',
  start: '',
  end: '',
  allDay: false,
  url: '',
  extendedProps: {
    calendar: '',
    guests: [],
    location: '',
    description: ''
  }
}



const Calendar = (props: CalendarType) => {
  // ** Props
  const {
    tasks,
    direction,
    calendarsColor,
    handleLeftSidebarToggle,
    setSelectedTask,
    handleAddTaskSidebarToggle
  } = props

  // ** Refs
  const calendarRef = useRef()

  // ** calendarOptions(Props)
  const calendarOptions = {
    events: tasks.map(t => ({
      id: t.taskId,
      title: t.taskName,
      end: t.dueDate,
      start: t.dueDate,
      allDay: true,
      extendedProps: {
        description: t.notes,
        calendar: CalendarColorsEnum[t.status]
      }
    })),
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      start: 'sidebarToggle, prev, next, title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    views: {
      week: {
        titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
      }
    },

    /*
    Enable dragging and resizing event
    ? Docs: https://fullcalendar.io/docs/editable
  */
    editable: true,

    /*
    Enable resizing event from start
    ? Docs: https://fullcalendar.io/docs/eventResizableFromStart
  */
    eventResizableFromStart: true,

    /*
      Automatically scroll the scroll-containers during event drag-and-drop and date selecting
      ? Docs: https://fullcalendar.io/docs/dragScroll
    */
    dragScroll: true,

    /*
      Max number of events within a given day
      ? Docs: https://fullcalendar.io/docs/dayMaxEvents
    */
    dayMaxEvents: 2,

    /*
      Determines if day names and week names are clickable
      ? Docs: https://fullcalendar.io/docs/navLinks
    */
    navLinks: true,

    eventClassNames({ event: calendarEvent }: any) {
      // @ts-ignore
      const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]

      return [
        // Background Color
        `bg-${colorName}`
      ]
    },

    eventClick({ event: clickedEvent }: any) {

      // dispatch(handleSelectEvent(clickedEvent))
      setSelectedTask([clickedEvent._def.publicId])
      handleAddTaskSidebarToggle()

      // * Only grab required field otherwise it goes in infinity loop
      // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
      // event.value = grabEventDataFromEventApi(clickedEvent)

      // isAddNewEventSidebarActive.value = true
    },

    customButtons: {
      sidebarToggle: {
        icon: 'bi bi-list',
        click() {
          handleLeftSidebarToggle()
        }
      }
    },

    dateClick() {
      setSelectedTask([])
      handleAddTaskSidebarToggle()
    },

    // /*
    //   Handle event drop (Also include dragged event)
    //   ? Docs: https://fullcalendar.io/docs/eventDrop
    //   ? We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
    // */
    // eventDrop({ event: droppedEvent }: any) {
    //   dispatch(updateEvent(droppedEvent))
    // },

    /*
      Handle event resize
      ? Docs: https://fullcalendar.io/docs/eventResize
    */
    // eventResize({ event: resizedEvent }: any) {
    //   dispatch(updateEvent(resizedEvent))
    // },

    ref: calendarRef,

    // Get direction from app state (store)
    direction
  }

  // @ts-ignore
  return <FullCalendar {...calendarOptions} />

}

export default Calendar
