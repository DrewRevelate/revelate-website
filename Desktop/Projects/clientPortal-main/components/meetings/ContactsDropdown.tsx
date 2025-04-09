'use client';

import { useEffect, useState } from 'react';
import Select from '../ui/Select';
import { supabase } from '@/lib/supabase/client';

// Simplified interface that doesn't make assumptions about nested structures
export interface Contact {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  company_id?: string | null;
  company_name?: string | null;
  // Don't define the companies field type at all to avoid TypeScript errors
}

interface ContactsDropdownProps {
  selectedContactId?: string;
  onChange: (contactId: string) => void;
  label?: string;
  error?: string;
  isFullWidth?: boolean;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
}

export default function ContactsDropdown({
  selectedContactId,
  onChange,
  label = 'Contact',
  error,
  isFullWidth = true,
  className = '',
  required = false,
  disabled = false,
  name = 'contact_id',
  id,
}: ContactsDropdownProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContacts() {
      try {
        setLoading(true);
        
        // Use a simpler query that doesn't rely on joins
        const { data, error } = await supabase
          .from('contacts')
          .select(`
            id,
            first_name,
            last_name,
            email,
            company_id
          `)
          .order('last_name', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        // Get company information separately if needed
        // This avoids the complex join that's causing TypeScript errors
        if (data && data.length > 0) {
          // We'll just use the data as is, without trying to access company names
          setContacts(data);
        } else {
          setContacts([]);
        }
        
        setFetchError(null);
      } catch (error: any) {
        console.error('Error fetching contacts:', error);
        setFetchError(error.message || 'Failed to load contacts');
      } finally {
        setLoading(false);
      }
    }

    fetchContacts();
  }, []);

  // Handle local change before bubbling up
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  // Format contact names without company info for now
  const formatContactLabel = (contact: Contact) => {
    const fullName = [contact.first_name, contact.last_name]
      .filter(Boolean)
      .join(' ');
    
    return fullName || contact.email;
  };

  // Create options for Select component
  const contactOptions = contacts.map(contact => ({
    value: contact.id,
    label: formatContactLabel(contact)
  }));

  // Show loading state or error
  if (loading) {
    return <Select 
      label={label}
      options={[{ value: '', label: 'Loading contacts...' }]}
      disabled
      isFullWidth={isFullWidth}
      className={className}
    />;
  }

  if (fetchError) {
    return <Select 
      label={label}
      options={[{ value: '', label: 'Error loading contacts' }]}
      error={fetchError}
      disabled
      isFullWidth={isFullWidth}
      className={className}
    />;
  }

  return (
    <Select
      label={label}
      options={contactOptions}
      value={selectedContactId}
      onChange={handleChange}
      error={error}
      isFullWidth={isFullWidth}
      className={className}
      required={required}
      disabled={disabled}
      name={name}
      id={id}
      helperText={contactOptions.length === 0 ? 'No contacts available. Create a contact first.' : undefined}
    />
  );
}
