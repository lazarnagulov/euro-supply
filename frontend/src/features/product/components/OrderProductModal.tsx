import React, { useState } from "react";
import { X } from "lucide-react";
import type { CompanySummaryResponse } from "../../company/types/company.types";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrder: (companyId: number, quantity: number) => void;
  companies: CompanySummaryResponse[];
  loading?: boolean;
}

const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  onOrder,
  companies,
  loading = false,
}) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleOrder = () => {
    if (!selectedCompanyId) {
      setError("Please select a company");
      return;
    }
    if (!quantity || quantity <= 0) {
      setError("Please enter a valid quantity");
      return;
    }

    setError("");
    onOrder(selectedCompanyId, Number(quantity));
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedCompanyId("");
      setQuantity("");
      setError("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="bg-blue-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold">Place Order</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Select Company
            </label>
            <select
              value={selectedCompanyId}
              onChange={(e) => {
                setSelectedCompanyId(
                  e.target.value === "" ? "" : Number(e.target.value)
                );
                setError("");
              }}
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">-- Choose a company --</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Quantity
            </label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => {
                setQuantity(
                  e.target.value === "" ? "" : Number(e.target.value)
                );
                setError("");
              }}
              placeholder="Enter quantity"
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>

        <div className="bg-gray-50 p-6 border-t border-gray-200 rounded-b-2xl flex justify-end gap-4">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={handleOrder}
            disabled={loading || !selectedCompanyId || !quantity}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed">
            {loading ? "Ordering..." : "Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;