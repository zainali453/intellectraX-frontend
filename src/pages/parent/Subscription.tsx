import React from "react";
import ParentSubscriptionCard from "../../components/ParentSubscriptionCard";

const Subscription = () => {
  return (
    <div className='px-8 py-6'>
      <div className='bg-white p-6 rounded-2xl'>
        <h2 className='text-2xl font-semibold mb-6 text-gray-800'>
          Children Subscription Plan
        </h2>
        <ParentSubscriptionCard
          name='John Smith'
          planLabel='Standard Plan'
          price={49}
          per='/month'
          classesRemaining={7}
          classesTotal={10}
          renewalDate='May 15, 2023'
          autoRenewalEnabled={true}
        />
      </div>
    </div>
  );
};

export default Subscription;
