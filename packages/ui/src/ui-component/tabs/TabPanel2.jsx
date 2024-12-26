import React from 'react';

const TabPanell = ({ children, activeTab }) => {
  return (
    <div className="tab-panels">
      {React.Children.map(children, (child, index) => {
        return React.cloneElement(child, {
          hidden: activeTab !== index,
          'aria-hidden': activeTab !== index,
        });
      })}
    </div>
  );
};

export default TabPanell;
