import { useState, useEffect } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { DollarSign, AlertCircle } from "lucide-react";

const EditAmountModal = ({ isOpen, onClose, onConfirm, booking }) => {
    const [amount, setAmount] = useState(booking?.amount || 0);
    const totalPrice = booking?.totalPrice || booking?.amount || 0;

    useEffect(() => {
        setAmount(booking?.amount || 0);
    }, [booking]);

    const handleConfirm = () => {
        onConfirm(amount);
        onClose();
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            center
            classNames={{
                modal: "rounded-2xl p-0 overflow-hidden max-w-md w-full",
                overlay: "bg-black/50 backdrop-blur-sm",
                closeButton: "hidden",
            }}
        >
            <div className="bg-[var(--Main)] p-6 text-white">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                        <DollarSign className="w-6 h-6 text-[var(--Yellow)]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Edit Payment Amount</h2>
                        <p className="text-white/60 text-sm">Update the collected amount for this booking</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Total Price</span>
                        <span className="text-lg font-bold text-gray-800">{totalPrice} {booking?.currency}</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Current Paid</span>
                        <span className="text-lg font-bold text-gray-800">{booking?.amount} {booking?.currency}</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Paid Amount
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            placeholder="Enter amount"
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-3 px-4 focus:outline-none focus:border-[var(--Yellow)] transition-all font-bold text-lg"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                            {booking?.currency}
                        </span>
                    </div>
                    {amount < totalPrice && (
                        <div className="mt-3 flex items-start space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <p className="text-xs leading-relaxed">
                                Setting an amount lower than the total will automatically mark this as an <strong>Installment</strong> payment.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex space-x-3 pt-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition-all text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 px-4 py-3 rounded-xl bg-[var(--Yellow)] text-[var(--Main)] font-bold hover:shadow-lg hover:shadow-[var(--Yellow)]/20 transition-all text-sm"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default EditAmountModal;
