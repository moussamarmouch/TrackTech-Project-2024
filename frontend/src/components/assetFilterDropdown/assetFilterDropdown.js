import React, { useState, useRef, useEffect } from 'react';
import './assetFilterDropdown.css';
import { Link } from 'react-router-dom';
import useGetAllAssetTypes from '../../hooks/use_get_all_assettypes'
import { useRecoilState, useRecoilValue } from 'recoil';
import { assetTypeFilterState, assetFlagFilterState, assetStartDateFilterState, assetEndDateFilterState,  isStatistics } from '../../store/store.js';

export default function AssetFilterdropdown() {
  const dropdownRef = useRef(null);
  const [isFirstDropdownOpen, setIsFirstDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isFlagDropdownOpen, setIsFlagDropdownOpen] = useState(false);

  const [selectedFlag, setSelectedFlag] = useRecoilState(assetFlagFilterState);
  const [selectedTypes, setSelectedTypes] = useRecoilState(assetTypeFilterState);
  const [selectedStartDate, setSelectedStartDate] = useRecoilState(assetStartDateFilterState);
  const [selectedEndDate, setSelectedEndDate] = useRecoilState(assetEndDateFilterState);
  const {
    assetTypes,
  } = useGetAllAssetTypes();
  // when clicked outside the dropdown, it closes
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Clicked outside the dropdown, close it
        setIsFirstDropdownOpen(false);
        setIsFlagDropdownOpen(false);
        setIsTypeDropdownOpen(false);
      }
    };

    // Add event listener when component mounts
    document.addEventListener('click', handleClickOutside);

    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  function toggleFirstDropdown() {
    setIsFirstDropdownOpen(!isFirstDropdownOpen);
  };

  function toggleFlagDropdown(){
    setIsFlagDropdownOpen(!isFlagDropdownOpen);
  };

  function toggleTypeDropdown() {
    setIsTypeDropdownOpen(!isTypeDropdownOpen);
  };

  function handleFlagFilterClick(filterOption) {
    setSelectedFlag(filterOption);
  };

  function handleTypeFilterClick(filterOption) {
    // Check if the type is already selected
  const isSelected = selectedTypes.includes(filterOption);

  // If selected, remove it; otherwise, add it
  if (isSelected) {
    setSelectedTypes((selectedTypes) =>
      selectedTypes.filter((selectedType) => selectedType !== filterOption)
    );
  } else {
    setSelectedTypes((selectedTypes) => [...selectedTypes, filterOption]);
    console.log(selectedTypes);
  }
  };

  function handleStartDateFilterClick(filterOption) {
    const currentDate = new Date();
    const selectedDate = new Date(filterOption);

    // Validate: Start date can't be tomorrow or after
    if (selectedDate > currentDate) {
        console.log("Start date can't be tomorrow or after.");
        return;
    }

    // Validate: End date should be after the start date
    if (selectedEndDate && selectedDate > new Date(selectedEndDate)) {
        console.log("End date should be after the start date.");
        return;
    }

    setSelectedStartDate(filterOption);
  };

  function handleEndDateFilterClick(filterOption) {
    const currentDate = new Date();
    const selectedDate = new Date(filterOption);

    // Validate: End date can't be tomorrow or after
    if (selectedDate > currentDate) {
        console.log("End date can't be tomorrow or after.");
        return;
    }

    // Validate: End date should be after the start date
    if (selectedStartDate && selectedDate < new Date(selectedStartDate)) {
        console.log("End date should be after the start date.");
        return;
    }

    setSelectedEndDate(filterOption);
  };

  function handleResetClick() {
    setSelectedFlag('false');
    setSelectedTypes([]);
    setSelectedStartDate('');
    setSelectedEndDate('');
    setIsTypeDropdownOpen(false);
    setIsFlagDropdownOpen(false);
  };

  function handleTypeResetClick() {
    setSelectedTypes([]);
    setIsTypeDropdownOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`filter-dropdown`}>
      <Link className='iconfilter' onClick={toggleFirstDropdown}><i className="fas fa-filter fa-2x icon"></i></Link>
      {isFirstDropdownOpen && (
        <div className="dropdown-content">
          <div className='filterheader'>
            <h4>Filters</h4>
            <button className="resetbutton" onClick={handleResetClick}><i className="fas fa-redo-alt"></i></button>
          </div>
          <hr/>
            <>
            <div className='sbsfilter'>
            <div>
              <FlaggedStatus 
                toggleFlagDropdown={toggleFlagDropdown}
                selectedFlag={selectedFlag}
                isFlagDropdownOpen={isFlagDropdownOpen}
                handleFlagFilterClick={handleFlagFilterClick}
              />
            </div>
          </div>
           <hr/>
           </>
          
          
          <Type 
            selectedTypes = {selectedTypes}
            toggleTypeDropdown = {toggleTypeDropdown}
            isTypeDropdownOpen = {isTypeDropdownOpen}
            assetTypes = {assetTypes}
            handleTypeFilterClick = {handleTypeFilterClick}
            handleTypeResetClick = {handleTypeResetClick}
          />
          <hr/>
          <DateRange 
            selectedStartDate = {selectedStartDate}
            handleStartDateFilterClick = {handleStartDateFilterClick}
            handleEndDateFilterClick = {handleEndDateFilterClick}
            selectedEndDate = {selectedEndDate}
          />
        </div>
      )}
    </div>
  );
};

function DateRange({selectedStartDate, handleStartDateFilterClick, handleEndDateFilterClick, selectedEndDate}) {
  return(
    <>
      <h3>Set a date-range:</h3>
      <div className='dateselector'>
        <label htmlFor="startdateFilter">Select StartDate: </label>
        <input
          type="date"
          id="startdateFilter"
          value={selectedStartDate}
          onChange={(e) => handleStartDateFilterClick(e.target.value)}
        />
      </div>
      <div className='dateselector'>
        <label htmlFor="enddateFilter">Select EndDate: </label>
        <input
          type="date"
          id="enddateFilter"
          value={selectedEndDate}
          onChange={(e) => handleEndDateFilterClick(e.target.value)}
        />
      </div>
    </>
  );
}

function Type({selectedTypes, toggleTypeDropdown, isTypeDropdownOpen, assetTypes, handleTypeFilterClick, handleTypeResetClick}) {
  return(
    <>
      <div className='filterheader'>
      <h3>Type:</h3>
      <button className="resetbutton" style={{ marginBottom: '10px' }} onClick={handleTypeResetClick}><i className="fas fa-redo-alt"></i></button>
      </div>
      {selectedTypes.length > 0 ? (
        <button onClick={toggleTypeDropdown} className={`${selectedTypes.length > 0 ? 'firstoption' : ''}`}>Types selected: {selectedTypes.length}</button>
      ) : (
        <button onClick={toggleTypeDropdown}>Select Type</button>
      )}
      {isTypeDropdownOpen && (
        <div className="second-dropdown-content">
          {assetTypes.map((type) => (
            <button key={type.id} onClick={() => handleTypeFilterClick(type.name)} className={selectedTypes.includes(type.name) ? 'selected' : ''}>
              {type.name}
            </button>
            ))}
        </div>
      )}
    </>
  );
}

function FlaggedStatus({selectedFlag, toggleFlagDropdown, isFlagDropdownOpen, handleFlagFilterClick}) {
  return(
    <>
      <h3>Flagged:</h3>
      {selectedFlag === 'true' ? (
            <button onClick={toggleFlagDropdown}>Flagged</button>
          ): selectedFlag === 'false' ?(
            <button onClick={toggleFlagDropdown}>Not flagged</button>
          ) : (
            <button onClick={toggleFlagDropdown}>All</button>
          )
        }
      {isFlagDropdownOpen && (
        <div className="second-dropdown-content">
          {selectedFlag === 'true' ? (
            <><button onClick={() => handleFlagFilterClick('false')}>Not flagged</button><button onClick={() => handleFlagFilterClick('all')}>All</button></>
          ): selectedFlag === 'false' ? (
            <><button onClick={() => handleFlagFilterClick('true')}>Flagged</button><button onClick={() => handleFlagFilterClick('all')}>All</button></>
          ): (
            <><button onClick={() => handleFlagFilterClick('false')}>Not flagged</button><button onClick={() => handleFlagFilterClick('true')}>Flagged</button></>
          )}
        </div>
      )}
    </>
  );
}
