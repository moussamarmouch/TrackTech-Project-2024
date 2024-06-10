import React, { useState, useRef, useEffect } from 'react';
import './filterdropdown.css';
import { Link } from 'react-router-dom';
import useGetAllAnomalyTypes from '../../hooks/use_get_all_anomalytypes';
import useGetAllSeverities from '../../hooks/use_get_all_severities';
import { useRecoilState, useRecoilValue } from 'recoil';
import { anomalyTypeFilterState, anomalyStatusFilterState, anomalyFlagFilterState, anomalySeverityFilterState, anomalyStartDateFilterState, anomalyEndDateFilterState, isStatistics } from '../../store/store.js';

export default function Filterdropdown() {
  const dropdownRef = useRef(null);
  const [isFirstDropdownOpen, setIsFirstDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isSeverityDropdownOpen, setIsSeverityDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isFlagDropdownOpen, setIsFlagDropdownOpen] = useState(false);

  const [selectedStatus, setSelectedStatus] = useRecoilState(anomalyStatusFilterState);
  const [selectedFlag, setSelectedFlag] = useRecoilState(anomalyFlagFilterState);
  const [selectedSeverities, setSelectedSeverities] = useRecoilState(anomalySeverityFilterState);
  const [selectedTypes, setSelectedTypes] = useRecoilState(anomalyTypeFilterState);
  const [selectedStartDate, setSelectedStartDate] = useRecoilState(anomalyStartDateFilterState);
  const [selectedEndDate, setSelectedEndDate] = useRecoilState(anomalyEndDateFilterState);
  const {
    anomalyTypes,
  } = useGetAllAnomalyTypes();
  const {
    anomalySeverities,
  } = useGetAllSeverities();

  const statistics = useRecoilValue(isStatistics);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  // when clicked outside the dropdown, it closes
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Clicked outside the dropdown, close it
        setIsFirstDropdownOpen(false);
        setIsStatusDropdownOpen(false);
        setIsFlagDropdownOpen(false);
        setIsSeverityDropdownOpen(false);
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
    setIsStatusDropdownOpen(false);
  };

  function toggleStatusDropdown(){
    setIsStatusDropdownOpen(!isStatusDropdownOpen);
  };

  function toggleFlagDropdown(){
    setIsFlagDropdownOpen(!isFlagDropdownOpen);
  };

  function toggleSeverityDropdown() {
    setIsSeverityDropdownOpen(!isSeverityDropdownOpen);
  };

  function toggleTypeDropdown() {
    setIsTypeDropdownOpen(!isTypeDropdownOpen);
  };

  function handleStatusFilterClick(filterOption) {
    setSelectedStatus(filterOption);
    //setIsStatusDropdownOpen(false);
  };

  function handleFlagFilterClick(filterOption) {
    setSelectedFlag(filterOption);
    //setIsFlagDropdownOpen(false);
  };

  function handleSeverityFilterClick (filterOption) {
      // Check if the type is already selected
      const isSelected = selectedSeverities.includes(filterOption);

      // If selected, remove it; otherwise, add it
  if (isSelected) {
    setSelectedSeverities((selectedSeverities) =>
      selectedSeverities.filter((selectedSeverity) => selectedSeverity !== filterOption)
    );
  } else {
    setSelectedSeverities((selectedSeverities) => [...selectedSeverities, filterOption]);
    console.log(selectedSeverities);
  }
    //setIsSeverityDropdownOpen(false);
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
    //setIsTypeDropdownOpen(false);
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
    setSelectedStatus('false');
    setSelectedFlag('false');
    setSelectedSeverities([]);
    setSelectedTypes([]);
    setSelectedStartDate('');
    setSelectedEndDate('');
    setIsStatusDropdownOpen(false);
    setIsSeverityDropdownOpen(false);
    setIsTypeDropdownOpen(false);
    setIsFlagDropdownOpen(false);
  };

  function handleTypeResetClick() {
    setSelectedTypes([]);
    setIsTypeDropdownOpen(false);
  };

  function handleSeverityResetClick() {
    setSelectedSeverities([]);
    setIsSeverityDropdownOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`filter-dropdown ${statistics ? 'statfilteralign' : ''}`}>
      <Link className='iconfilter' onClick={toggleFirstDropdown}><i className={`fas fa-filter icon ${windowWidth < 700 ? 'fa-1x' : 'fa-2x'}`}></i></Link>
      {isFirstDropdownOpen && (
        <div className="dropdown-content">
          <div className='filterheader'>
            <h4>Filters</h4>
            <button className="resetbutton" onClick={handleResetClick}><i className="fas fa-redo-alt"></i></button>
          </div>
          <hr/>
          {!statistics && (
            <>
            <div className='sbsfilter'>
            <div>
              <SolvedStatus
                toggleStatusDropdown={toggleStatusDropdown}
                selectedStatus={selectedStatus}
                isStatusDropdownOpen={isStatusDropdownOpen}
                handleStatusFilterClick={handleStatusFilterClick}
              />
            </div>
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
          )}
          <Severity 
            selectedSeverities = {selectedSeverities}
            toggleSeverityDropdown = {toggleSeverityDropdown}
            isSeverityDropdownOpen = {isSeverityDropdownOpen}
            handleSeverityFilterClick = {handleSeverityFilterClick}
            anomalySeverities = {anomalySeverities}
            handleSeverityResetClick = {handleSeverityResetClick}
          />
          <hr/>
          <Type 
            selectedTypes = {selectedTypes}
            toggleTypeDropdown = {toggleTypeDropdown}
            isTypeDropdownOpen = {isTypeDropdownOpen}
            anomalyTypes = {anomalyTypes}
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

function Type({selectedTypes, toggleTypeDropdown, isTypeDropdownOpen, anomalyTypes, handleTypeFilterClick, handleTypeResetClick}) {
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
          {anomalyTypes.map((type) => (
            <button key={type.id} onClick={() => handleTypeFilterClick(type.name)} className={selectedTypes.includes(type.name) ? 'selected' : ''}>
              {type.name}
            </button>
            ))}
        </div>
      )}
    </>
  );
}

function Severity({selectedSeverities, toggleSeverityDropdown, isSeverityDropdownOpen, handleSeverityFilterClick, anomalySeverities, handleSeverityResetClick}) {
  return(
    <>
      <div className='filterheader'>
      <h3>Severity:</h3>
      <button className="resetbutton" style={{ marginBottom: '10px' }} onClick={handleSeverityResetClick}><i className="fas fa-redo-alt"></i></button>
      </div>
      {selectedSeverities.length > 0 ? (
        <button onClick={toggleSeverityDropdown} className={`${selectedSeverities.length > 0 ? 'firstoption' : ''}`}>Severities selected: {selectedSeverities.length}</button>
      ) : (
        <button onClick={toggleSeverityDropdown}>Select Severity</button>
      )}
      {isSeverityDropdownOpen && (
        <div className="second-dropdown-content">
          {anomalySeverities.map((severity) => (
            <button key={severity} onClick={() => handleSeverityFilterClick(severity)} className={selectedSeverities.includes(severity) ? 'selected' : ''}>
              {severity}
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

function SolvedStatus({toggleStatusDropdown, selectedStatus, isStatusDropdownOpen, handleStatusFilterClick}) {
  return (
    <>
      <h3>Status:</h3>
      {selectedStatus === 'true' ? (
            <button onClick={toggleStatusDropdown}>Solved</button>
          ): selectedStatus === 'false' ?(
            <button onClick={toggleStatusDropdown}>Not Solved</button>
          ) : (
            <button onClick={toggleStatusDropdown}>All</button>
          )
        }
      {isStatusDropdownOpen && (
        <div className="second-dropdown-content">
          {selectedStatus === 'true' ? (
            <><button onClick={() => handleStatusFilterClick('false')}>Not solved</button><button onClick={() => handleStatusFilterClick('all')}>All</button></>
          ): selectedStatus === 'false' ? (
            <><button onClick={() => handleStatusFilterClick('true')}>Solved</button><button onClick={() => handleStatusFilterClick('all')}>All</button></>
          ): (
            <><button onClick={() => handleStatusFilterClick('false')}>Not solved</button><button onClick={() => handleStatusFilterClick('true')}>Solved</button></>
          )}
        </div>
      )}
    </>
  );
}
