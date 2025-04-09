'use client';

import { Card } from '@/components/ui/Card';
import MeetingForm from '@/components/meetings/MeetingForm';
import { useParams } from 'next/navigation';

export default function EditMeetingPage() {
  const params = useParams();
  const meetingId = params?.id as string;

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Meeting</h1>
      
      <Card className="max-w-3xl mx-auto">
        <div className="p-6">
          <MeetingForm meetingId={meetingId} />
        </div>
      </Card>
    </div>
  );
}
