import React from "react";

interface ProductStatsModalProps {
  open: boolean;
  onClose: () => void;
  productName?: string;
}

export const ProductStatsModal: React.FC<ProductStatsModalProps> = ({
  open,
  onClose,
  productName,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">
          Statistics for {productName || "Product"}
        </h2>
        <p className="text-gray-600">Stats content will be here...</p>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
