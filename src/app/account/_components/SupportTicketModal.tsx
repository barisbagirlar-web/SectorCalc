'use client';

import { useState, useRef } from 'react';
import { getFirebaseAuth } from '@/lib/infrastructure/firebase/auth';

type TicketStatus = 'idle' | 'sending' | 'success' | 'error';

const HONEYPOT_FIELD = '_hp_confirm_email';

export function SupportTicketModal({ userId, email }: { userId: string; email: string }) {
  const [status, setStatus] = useState<TicketStatus>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    const auth = getFirebaseAuth();
    const user = auth?.currentUser;
    if (!user) {
      setStatus('error');
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: formData.get('subject'),
          message: formData.get('message'),
          priority: formData.get('priority') || 'normal',
          [HONEYPOT_FIELD]: formData.get(HONEYPOT_FIELD),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.details ?? 'Failed to submit ticket');
      }

      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <dialog
      id="support-modal"
      className="modal"
      onClose={() => setStatus('idle')}
    >
      <form ref={formRef} method="dialog" className="p-6" onSubmit={handleSubmit}>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Submit a Support Ticket</h3>

        {/* Honeypot - invisible to users, catches bots */}
        <input
          type="text"
          name={HONEYPOT_FIELD}
          autoComplete="off"
          tabIndex={-1}
          className="absolute -left-[9999px] -top-[9999px]"
          aria-hidden="true"
        />

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input type="text" name="subject" required minLength={5} maxLength={200} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select name="priority" defaultValue="normal" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea name="message" rows={4} required minLength={20} maxLength={5000} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
          </div>
          {status === 'success' && (
            <p className="text-sm text-green-600 font-medium" role="status">Ticket submitted successfully.</p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-600 font-medium" role="alert">Failed to submit. Please try again.</p>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              disabled={status === 'sending'}
              onClick={() => (document.getElementById('support-modal') as HTMLDialogElement)?.close()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {status === 'sending' ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </div>
      </form>
    </dialog>
  );
}
