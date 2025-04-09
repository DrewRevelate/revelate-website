'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import ContactsDropdown from './ContactsDropdown';

interface MeetingFormProps {
  meetingId?: string;
}

export default function MeetingForm({ meetingId }: MeetingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    meeting_date: '',
    contact_id: '',
    meeting_link: '',
  });

  // Load existing meeting data if editing
  useEffect(() => {
    if (meetingId) {
      const fetchMeeting = async () => {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('meetings')
            .select('*')
            .eq('id', meetingId)
            .single();

          if (error) {
            throw error;
          }

          if (data) {
            // Format date for input
            const meetingDate = new Date(data.meeting_date);
            const formattedDate = meetingDate.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm

            setFormData({
              title: data.title || '',
              description: data.description || '',
              meeting_date: formattedDate,
              contact_id: data.contact_id || '',
              meeting_link: data.meeting_link || '',
            });
          }
        } catch (error: any) {
          console.error('Error fetching meeting:', error);
          setError(error.message || 'Failed to load meeting');
        } finally {
          setLoading(false);
        }
      };

      fetchMeeting();
    }
  }, [meetingId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactChange = (contactId: string) => {
    setFormData((prev) => ({
      ...prev,
      contact_id: contactId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      // Validate required fields
      if (!formData.title || !formData.meeting_date) {
        throw new Error('Title and meeting date are required');
      }

      if (meetingId) {
        // Update existing meeting
        const { error } = await supabase
          .from('meetings')
          .update({
            title: formData.title,
            description: formData.description,
            meeting_date: formData.meeting_date,
            contact_id: formData.contact_id || null,
            meeting_link: formData.meeting_link || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', meetingId);

        if (error) throw error;
      } else {
        // Create new meeting
        const { error } = await supabase.from('meetings').insert({
          title: formData.title,
          description: formData.description,
          meeting_date: formData.meeting_date,
          contact_id: formData.contact_id || null,
          meeting_link: formData.meeting_link || null,
        });

        if (error) throw error;
      }

      // Redirect to meetings list
      router.push('/meetings');
      router.refresh();
    } catch (error: any) {
      console.error('Error saving meeting:', error);
      setError(error.message || 'Failed to save meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      <Input
        label="Title"
        id="title"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        required
        disabled={loading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Meeting Date & Time"
          id="meeting_date"
          name="meeting_date"
          type="datetime-local"
          value={formData.meeting_date}
          onChange={handleInputChange}
          required
          disabled={loading}
        />

        <ContactsDropdown
          selectedContactId={formData.contact_id}
          onChange={handleContactChange}
          disabled={loading}
        />
      </div>

      <Input
        label="Meeting Link"
        id="meeting_link"
        name="meeting_link"
        type="url"
        value={formData.meeting_link}
        onChange={handleInputChange}
        helperText="Zoom, Teams, or other video conferencing link"
        disabled={loading}
      />

      <Textarea
        label="Description"
        id="description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        disabled={loading}
      />

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : meetingId ? 'Update Meeting' : 'Create Meeting'}
        </Button>
      </div>
    </form>
  );
}
