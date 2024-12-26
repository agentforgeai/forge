import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TabContainer = styled.div`
  display: inline-flex;
  background-color: #F3F4F6;
  border-radius: 6px;
  padding: 4px;
  min-height: 35px;
  align-items: center;
  gap: 4px;
`;

const TabButton = styled.button`
  text-transform: none;
  min-height: 30px;
  height: 30px;
  font-size: 13px;
  font-weight: 400;
  opacity: ${props => props.active ? 1 : 0.5};
  color: #000;
  padding: 0 12px;
  border-radius: 6px;
  border: 1px solid ${props => props.active ? '#D9D9E0' : 'transparent'};
  background: ${props => props.active ? '#fff' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;

  &:hover {
    background-color: #fff;
  }

  &:focus {
    outline: none;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const NavigationTab = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 0, label: 'Workflow' },
    { id: 1, label: 'Export' },
  ];

  const handleTabClick = (tabId) => {
    if (typeof onTabChange === 'function') {
      onTabChange(tabId);
    }
  };

  return (
    <TabContainer>
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => handleTabClick(tab.id)}
          active={activeTab === tab.id}
        >
          {tab.label}
        </TabButton>
      ))}
    </TabContainer>
  );
};

NavigationTab.propTypes = {
  activeTab: PropTypes.number.isRequired,
  onTabChange: PropTypes.func.isRequired
};

export default NavigationTab;
