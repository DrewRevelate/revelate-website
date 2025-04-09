'use client';

import { Card } from '@/components/ui/Card';
import MeetingForm from '@/components/meetings/MeetingForm';

export default function NewMeetingPage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Schedule New Meeting</h1>
      
      <Card className="max-w-3xl mx-auto">
        <div className="p-6">
          <MeetingForm />
        </div>
      </Card>
    </div>
  );
}
