'use client';

import { useState } from 'react';

export function SupportTicketModal({ userId, email }: { userId: string; email: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <dialog 
      id="support-modal" 
      className="modal p-0 rounded-xl shadow-2xl backdrop:bg-black/30 w-full max-w-lg"
      onClose={() => setIsOpen(false)}
    >
      <form method="dialog" className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Submit a Support Ticket</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input type="text" name="subject" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea name="message" rows={4} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => (document.getElementById('support-modal') as HTMLDialogElement)?.close()} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700">Submit Ticket</button>
          </div>
        </div>
      </form>
    </dialog>
  );
}
