import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { DollarSign, Plus, X } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const PricingDetails = forwardRef((props, ref) => {
    const { user } = useUser();
    const email = props.email || user?.email;
    const role = props.role || user?.role;
    const [pricingDetails, setPricingDetails] = useState([
        { id: 1, price: '' }
    ]);
    const [cardDetails, setCardDetails] = useState({
        cardHolder: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    useEffect(() => {
        // Populate pricing details from props or set to default
        if (props.PricingDetails && Array.isArray(props.PricingDetails) && props.PricingDetails.length > 0) {
            setPricingDetails(
                props.PricingDetails.map((slot, idx) => ({
                    id: slot._id || slot.id || idx + 1,
                    price: slot.price ? slot.price.toString() : ''
                }))
            );
        } else {
            setPricingDetails([{ id: 1, price: '' }]);
        }

        // Populate card details from props or set to default
        if (props.cardDetails) {
            setCardDetails({
                cardHolder: props.cardDetails.cardHolder || '',
                cardNumber: props.cardDetails.cardNumber || '',
                expiryDate: props.cardDetails.expiryDate || '',
                cvv: props.cardDetails.cvv || props.cardDetails.cvc || ''
            });
        } else {
            setCardDetails({
                cardHolder: '',
                cardNumber: '',
                expiryDate: '',
                cvv: ''
            });
        }
    }, [props.PricingDetails, props.cardDetails]);

    // Function to check if all required fields are filled
    const areAllFieldsFilled = () => {
        // Check if at least one pricing slot has a valid price
        const hasValidPricing = pricingDetails.some(detail => 
            detail.price && Number(detail.price) > 0
        );
        
        // Check if all card details are filled
        const hasValidCardDetails = 
            cardDetails.cardHolder.trim() !== '' &&
            cardDetails.cardNumber.replace(/\s/g, '').length === 16 &&
            cardDetails.expiryDate.length === 5 &&
            cardDetails.cvv.length === 3;
        
        return hasValidPricing && hasValidCardDetails;
    };

    // Function to send data to parent only when all fields are filled
    const sendDataToParent = () => {
        if (areAllFieldsFilled()) {
            const data = {
                pricingDetails: pricingDetails.filter(detail => detail.price && Number(detail.price) > 0),
                cardDetails: {
                    ...cardDetails,
                    cardNumber: cardDetails.cardNumber.replace(/\s/g, '')
                }
            };
            
            console.log('WTF man - PricingDetails sending complete data to parent:', data);
            
            if (props.onPricingChange) {
                props.onPricingChange(data.pricingDetails);
            }
            if (props.onCardDetailsChange) {
                props.onCardDetailsChange(data.cardDetails);
            }
        }
    };

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        getData: () => {
            console.log('PricingDetails getData called:', { pricingDetails, cardDetails });
            return {
                pricingDetails: pricingDetails.filter(detail => detail.price && Number(detail.price) > 0),
                cardDetails: {
                    ...cardDetails,
                    cardNumber: cardDetails.cardNumber.replace(/\s/g, '')
                }
            };
        }
    }));

    const handleAddPricingSlot = () => {
        const updatedDetails = [
            ...pricingDetails,
            { id: Date.now(), price: '' }
        ];
        setPricingDetails(updatedDetails);
        // Don't send to parent immediately - wait for fields to be filled
    };

    const handleRemovePricingSlot = (id) => {
        const updatedDetails = pricingDetails.filter(slot => slot.id !== id);
        setPricingDetails(updatedDetails);
        // Don't send to parent immediately - wait for fields to be filled
    };

    const handlePricingChange = (id, value) => {
        const updatedDetails = pricingDetails.map(slot =>
            slot.id === id ? { ...slot, price: value } : slot
        );
        setPricingDetails(updatedDetails);
        // Don't send to parent immediately - wait for fields to be filled
    };

    const handleCardDetailsChange = (field, value) => {
        let processedValue = value;
        
        // Format card number with spaces
        if (field === 'cardNumber') {
            processedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        }
        // Format expiry date
        else if (field === 'expiryDate') {
            processedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2');
        }
        // Format CVV
        else if (field === 'cvv') {
            processedValue = value.replace(/\D/g, '').slice(0, 3);
        }

        const updated = { ...cardDetails, [field]: processedValue };
        setCardDetails(updated);
        // Don't send to parent immediately - wait for fields to be filled
    };

    // Check if all fields are filled whenever state changes
    useEffect(() => {
        sendDataToParent();
    }, [pricingDetails, cardDetails]);

    // Format card number with spaces
    const formatCardNumber = (value) => {
        const val = value.replace(/\s/g, '');
        const groups = val.match(/.{1,4}/g) || [];
        return groups.join(' ');
    };

    // Format expiry date with slash
    const formatExpiryDate = (value) => {
        const val = value.replace(/\D/g, '');
        if (val.length >= 2) {
            return val.slice(0, 2) + '/' + val.slice(2);
        }
        return val;
    };

    return (
        <div className="space-y-8">
            {/* Session Pricing */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Session Pricing</h3>
                <div className="space-y-4">
                    {pricingDetails.map((slot) => (
                        <div key={`pricing-${slot.id}`} className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pricing per session
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        value={slot.price}
                                        onChange={(e) => handlePricingChange(slot.id, e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => handleRemovePricingSlot(slot.id)}
                                className="mt-6 p-2 text-gray-400 hover:text-red-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    
                    <button
                        onClick={handleAddPricingSlot}
                        className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-teal-600 hover:border-teal-500 transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Price Option
                    </button>
                </div>
            </div>

            {/* Payment Details */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card Holder Name
                        </label>
                        <input
                            type="text"
                            value={cardDetails.cardHolder}
                            onChange={(e) => handleCardDetailsChange('cardHolder', e.target.value)}
                            placeholder="John Doe"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number
                        </label>
                        <input
                            type="text"
                            value={cardDetails.cardNumber}
                            onChange={(e) => {
                                const formatted = formatCardNumber(e.target.value);
                                if (formatted.length <= 19) { // 16 digits + 3 spaces
                                    handleCardDetailsChange('cardNumber', formatted);
                                }
                            }}
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date
                        </label>
                        <input
                            type="text"
                            value={cardDetails.expiryDate}
                            onChange={(e) => {
                                const formatted = formatExpiryDate(e.target.value);
                                if (formatted.length <= 5) {
                                    handleCardDetailsChange('expiryDate', formatted);
                                }
                            }}
                            placeholder="MM/YY"
                            maxLength="5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                        </label>
                        <input
                            type="text"
                            value={cardDetails.cvv}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                if (val.length <= 3) {
                                    handleCardDetailsChange('cvv', val);
                                }
                            }}
                            placeholder="123"
                            maxLength="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                    Your card information is securely encrypted and stored. We'll use this for processing your earnings.
                </p>
            </div>
        </div>
    );
});

export default PricingDetails; 