export default function SOSConfirmModal({ open, onClose, onConfirm, sending }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl">
        <div className="px-5 pt-5">
          <div className="text-base font-semibold text-white">Confirm SOS</div>
          <div className="mt-2 text-sm text-white/70">
            This will send your live location to your emergency contacts and DC Academy.
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 px-5 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/80 hover:bg-white/[0.09]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={sending}
            className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send SOS"}
          </button>
        </div>
      </div>
    </div>
  );
}