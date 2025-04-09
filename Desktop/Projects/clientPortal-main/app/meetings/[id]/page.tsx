"use client";

import DashboardLayout from '@/components/layout/Dashboard';
import Link from 'next/link';
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiClock, 
  FiUsers, 
  FiVideo,
  FiFileText,
  FiDownload,
  FiLink,
  FiPaperclip,
  FiCheck,
  FiX,
} from 'react-icons/fi';

interface MeetingDetailsProps {
  params: {
    id: string;
  };
}

// Define status type to match the keys in statusStyles
type MeetingStatus = 'Upcoming' | 'Live' | 'Completed' | 'Cancelled';
// Define response type to match the keys in responseStyles
type AttendeeResponse = 'Accepted' | 'Declined' | 'Tentative' | 'Pending';

export default function MeetingDetails({ params }: MeetingDetailsProps) {
  // Sample meeting data (in a real app, this would be fetched based on the ID)
  const meeting = {
    id: params.id,
    title: 'Weekly Progress Review',
    description: 'Review project progress and discuss next steps for the CRM integration. We will cover current status, blockers, and priorities for the upcoming week.',
    date: 'March 22, 2025',
    time: '10:00 AM',
    endTime: '11:00 AM',
    duration: '60 min',
    timezone: 'Eastern Time (ET)',
    status: 'Upcoming' as MeetingStatus,
    project: 'CRM Integration',
    attendees: [
      { name: 'Alex Thompson', role: 'Project Manager', response: 'Accepted' as AttendeeResponse },
      { name: 'Sarah Miller', role: 'Developer', response: 'Accepted' as AttendeeResponse },
      { name: 'Jason Patel', role: 'Data Analyst', response: 'Tentative' as AttendeeResponse },
      { name: 'You', role: 'Client', response: 'Accepted' as AttendeeResponse }
    ],
    meetingLink: 'https://zoom.us/j/123456789',
    meetingId: '123 456 789',
    meetingPasscode: '789123',
    dialInNumber: '+1 123-456-7890',
    recordingLink: null,
    transcriptLink: null,
    agenda: [
      { id: 1, item: 'Project status update (15 min)' },
      { id: 2, item: 'Review of completed tasks (10 min)' },
      { id: 3, item: 'Discussion of current blockers (15 min)' },
      { id: 4, item: 'Next steps and priorities (15 min)' },
      { id: 5, item: 'Questions and action items (5 min)' }
    ],
    documents: [
      { name: 'Meeting Agenda.pdf', size: '245 KB', uploadedAt: 'March 20, 2025' },
      { name: 'Project Timeline.xlsx', size: '1.2 MB', uploadedAt: 'March 20, 2025' }
    ],
    recap: null,
    organizer: 'Alex Thompson'
  };

  // Status styling
  const statusStyles: Record<MeetingStatus, string> = {
    'Upcoming': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'Live': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'Completed': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  };

  // Attendee response styling
  const responseStyles: Record<AttendeeResponse, string> = {
    'Accepted': 'text-green-700 dark:text-green-400',
    'Declined': 'text-red-700 dark:text-red-400',
    'Tentative': 'text-yellow-700 dark:text-yellow-400',
    'Pending': 'text-gray-500 dark:text-gray-400'
  };

  const responseIcons: Record<AttendeeResponse, React.ReactNode> = {
    'Accepted': <FiCheck className="h-4 w-4" />,
    'Declined': <FiX className="h-4 w-4" />,
    'Tentative': <FiClock className="h-4 w-4" />,
    'Pending': <FiClock className="h-4 w-4" />
  };

  // Format a calendar link
  const getGoogleCalendarLink = () => {
    const startDate = new Date(`${meeting.date} ${meeting.time}`);
    const endDate = new Date(`${meeting.date} ${meeting.endTime}`);
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(meeting.title)}&details=${encodeURIComponent(meeting.description)}&location=${encodeURIComponent(meeting.meetingLink)}&dates=${formatDate(startDate)}/${formatDate(endDate)}`;
  };

  return (
    <DashboardLayout>
      {/* Back button and meeting title */}
      <div className="mb-6">
        <Link
          href="/meetings"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          Back to Meetings
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{meeting.title}</h1>
            <div className="mt-1 flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[meeting.status]}`}>
                {meeting.status}
              </span>
              <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                {meeting.project}
              </span>
            </div>
          </div>
          
          {meeting.status === 'Upcoming' && (
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
              <a
                href={meeting.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FiVideo className="mr-2 h-4 w-4" />
                Join Meeting
              </a>
              <a
                href={getGoogleCalendarLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <FiCalendar className="mr-2 h-4 w-4" />
                Add to Calendar
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Meeting details grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Meeting details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Description
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {meeting.description}
            </p>
          </div>

          {/* Agenda card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Agenda
            </h2>
            {meeting.agenda.length > 0 ? (
              <ol className="space-y-3 list-decimal list-inside text-gray-700 dark:text-gray-300">
                {meeting.agenda.map((item) => (
                  <li key={item.id}>{item.item}</li>
                ))}
              </ol>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No agenda items</p>
            )}
          </div>

          {/* Attendees card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Attendees
            </h2>
            <div className="space-y-3">
              {meeting.attendees.map((attendee, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-md"
                >
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {attendee.name} {attendee.name === 'You' && '(You)'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {attendee.role}
                    </div>
                  </div>
                  <div className={`flex items-center ${responseStyles[attendee.response]}`}>
                    {responseIcons[attendee.response]}
                    <span className="ml-1.5">{attendee.response}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Meeting Documents
            </h2>
            {meeting.documents.length > 0 ? (
              <div className="space-y-3">
                {meeting.documents.map((document, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-750"
                  >
                    <div className="flex items-center">
                      <div className="text-gray-400 mr-3">
                        <FiFileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {document.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {document.size} • Uploaded {document.uploadedAt}
                        </p>
                      </div>
                    </div>
                    <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 dark:text-primary-100 dark:bg-primary-900/30 dark:hover:bg-primary-900/40">
                      <FiDownload className="mr-1.5 h-3.5 w-3.5" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No documents available</p>
            )}
          </div>

          {/* Recap card - only shown for completed meetings */}
          {meeting.status === 'Completed' && (
            <div id="recap" className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Meeting Recap
              </h2>
              {meeting.recap ? (
                <>
                  <div className="prose prose-blue dark:prose-dark max-w-none text-gray-700 dark:text-gray-300">
                    {meeting.recap}
                  </div>
                  {meeting.recordingLink && (
                    <div className="mt-4">
                      <a
                        href={meeting.recordingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <FiVideo className="mr-2 h-4 w-4" />
                        View Recording
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Meeting recap will be available after the meeting is completed.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right column - Meeting metadata */}
        <div className="space-y-6">
          {/* Meeting info card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Meeting Information
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date & Time</h3>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FiCalendar className="mr-2 h-4 w-4 text-gray-400" />
                  {meeting.date} at {meeting.time}
                </div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 ml-6">
                  {meeting.duration} • {meeting.timezone}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</h3>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[meeting.status]}`}>
                  {meeting.status}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Project</h3>
                <div className="text-gray-700 dark:text-gray-300">
                  <Link
                    href={`/projects/1`}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    {meeting.project}
                  </Link>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Organizer</h3>
                <div className="text-gray-700 dark:text-gray-300">
                  {meeting.organizer}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Attendees</h3>
                <div className="text-gray-700 dark:text-gray-300">
                  {meeting.attendees.length} participants
                </div>
              </div>
            </div>
          </div>

          {/* Join info card - only for upcoming meetings */}
          {meeting.status === 'Upcoming' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Join Information
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Meeting Link</h3>
                  <a
                    href={meeting.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
                  >
                    <FiLink className="mr-2 h-4 w-4" />
                    Join Zoom Meeting
                  </a>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Meeting ID</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-gray-700 dark:text-gray-300">{meeting.meetingId}</div>
                    <button
                      onClick={() => navigator.clipboard.writeText(meeting.meetingId)}
                      className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Passcode</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-gray-700 dark:text-gray-300">{meeting.meetingPasscode}</div>
                    <button
                      onClick={() => navigator.clipboard.writeText(meeting.meetingPasscode)}
                      className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Dial-in</h3>
                  <div className="text-gray-700 dark:text-gray-300">{meeting.dialInNumber}</div>
                </div>
              </div>
            </div>
          )}

          {/* Actions card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Actions
            </h2>
            <div className="space-y-3">
              {meeting.status === 'Upcoming' && (
                <>
                  <a
                    href={meeting.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <FiVideo className="mr-2 h-4 w-4" />
                    Join Meeting
                  </a>
                  <a
                    href={getGoogleCalendarLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <FiCalendar className="mr-2 h-4 w-4" />
                    Add to Calendar
                  </a>
                </>
              )}
              <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <FiPaperclip className="mr-2 h-4 w-4" />
                Upload Document
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
