interface VisitorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VisitorModal({ isOpen, onClose }: VisitorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome, Visitor!</h2>
          <p className="text-gray-600 mb-6">
            You have read-only access to the Daniel Itwaru application. You can browse and view
            content, but cannot make any changes.
          </p>

          <div className="text-left mb-6">
            <h3 className="font-medium text-gray-900 mb-2">What you can do:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✅ View all pages and content</li>
              <li>✅ Browse through sections</li>
              <li>✅ Read application information</li>
            </ul>
          </div>

          <div className="text-left mb-6">
            <h3 className="font-medium text-gray-900 mb-2">What you cannot do:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>❌ Edit any content</li>
              <li>❌ Create new pages or sections</li>
              <li>❌ Delete anything</li>
            </ul>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
