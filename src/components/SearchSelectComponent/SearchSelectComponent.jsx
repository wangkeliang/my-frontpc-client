import React, { useState, useEffect } from 'react';
import '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css';
import styles from './SearchSelectComponent.module.css';

const SearchSelectComponent = ({
  selecteditemid,
  textDisplayField,
  tableTitle,
  searchColum,
  sourcelist = [],
  onSelect,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [innerSourceList, setInnerSourceList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [displayValue, setDisplayValue] = useState('');

  // 拖动相关状态
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({
    x: (window.innerWidth - window.innerWidth * 0.8) / 2,
    y: (window.innerHeight - window.innerHeight * 0.8) / 2,
  });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const formatInnerSourceList = sourcelist.map((item) => {
      const formattedItem = {
        id: item.id,
        displayValue: textDisplayField.map((field) => item[field]).join(' '),
        searchValue: (tableTitle[searchColum] || [])
          .map((field) => item[field] || '')
          .join(' ')
          .toLowerCase(),
      };

      Object.keys(tableTitle).forEach((key) => {
        formattedItem[key] = (tableTitle[key] || [])
          .map((field) => item[field] || '')
          .join(' ');
      });

      return formattedItem;
    });

    setInnerSourceList(formatInnerSourceList);

    if (selecteditemid) {
      const selected = formatInnerSourceList.find(
        (item) => String(item.id) === String(selecteditemid)
      );
      if (selected) {
        setDisplayValue(selected.displayValue);
        setSearchResults([selected]);
      } else {
        setSearchResults(formatInnerSourceList);
      }
    } else {
      setSearchResults(formatInnerSourceList);
    }
  }, [selecteditemid, sourcelist, textDisplayField, tableTitle, searchColum]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  
    if (selecteditemid && innerSourceList.length > 0) {
      const selectedItem = innerSourceList.find(
        (item) => item.id === selecteditemid
      );
      if (selectedItem) {
        setSearchValue(selectedItem[searchColum] || ''); // 设置搜索框值
  
        // 将选中的记录插入搜索结果中
        const updatedResults = innerSourceList.filter((item) =>
          item.searchValue.includes(selectedItem.searchValue)
        );
  
        setSearchResults(updatedResults);
  
        // 确保当前页包含选中的记录
        const selectedIndex = updatedResults.findIndex(
          (item) => item.id === selecteditemid
        );
        if (selectedIndex !== -1) {
          setCurrentPage(Math.floor(selectedIndex / itemsPerPage) + 1);
        }
      } else {
        setSearchValue('');
        setSearchResults(innerSourceList);
      }
    } else {
      setSearchValue('');
      setSearchResults(innerSourceList);
      setCurrentPage(1); // 默认回到第一页
    }
  };
  

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);

    const filteredResults = innerSourceList.filter((item) =>
      item.searchValue.includes(value)
    );

    setSearchResults(filteredResults);
    setCurrentPage(1);
  };

  const handleSelectItem = (item) => {
    if (onSelect) {
      onSelect(item);
      setDisplayValue(item.displayValue);
    }
    handleCloseModal();
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(searchResults.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // 拖动功能实现
  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div className={styles.searchSelectContainer}>
      <div className="slds-form-element">
        <div className={`${styles.inputContainer} slds-form-element__control`}>
          <input
            type="text"
            className={`${styles.searchInput} slds-input`}
            value={displayValue}
            readOnly
            onClick={handleOpenModal}
            placeholder="検索..."
          />
          <span className={`${styles.searchIcon}`}>
            <svg
              className="slds-icon slds-icon_x-small slds-icon-text-default"
              aria-hidden="true"
            >
              <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
            </svg>
          </span>
        </div>
      </div>

      {isModalOpen && (
        <section
          role="dialog"
          tabIndex="-1"
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: '80%',
            height: '80%',
            overflow: 'hidden',
            zIndex: 1000,
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div className="slds-modal__container">
            <header
              className="slds-modal__header"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              style={{ 
                cursor: 'move',
               }}
            >
              <button
                className="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse"
                onClick={handleCloseModal}
              >
                <svg
                  className="slds-button__icon slds-button__icon_large"
                  aria-hidden="true"
                >
                  <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span className="slds-assistive-text">閉じる</span>
              </button>
              <h2 className="slds-text-heading_medium">選択項目</h2>
            </header>
            <div className="slds-modal__content slds-p-around_medium">
              <label className="slds-form-element__label" htmlFor="search-input">
                検索
              </label>
              <input
                type="text"
                id="search-input"
                className="slds-input"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="検索..."
                style={{ fontSize: '0.9rem', marginBottom: '10px' }}
              />
              <div style={{ marginBottom: '10px', fontSize: '0.85rem' }}>
                表示件数：{searchResults.length} 件
              </div>
              <div style={{ 
                marginTop: '10px',
                }}>
                <table className="slds-table slds-table_cell-buffer slds-table_bordered">
                  <thead>
                    <tr>
                      {Object.keys(tableTitle).map((key, index) => (
                        <th key={index}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => handleSelectItem(item)}
                        style={{ cursor: 'pointer' }}
                      >
                        {Object.keys(tableTitle).map((key, index) => (
                          <td key={index}>{item[key]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {searchResults.length > itemsPerPage && (
                <div className={styles.pagination}>
                  {pageNumbers.map((number) => (
                    <a
                      key={number}
                      onClick={() => handlePageChange(number)}
                      className={currentPage === number ? styles.active : ''}
                      style={{
                        cursor: 'pointer',
                        margin: '0 5px',
                        textDecoration: 'underline',
                        color: currentPage === number ? 'black' : 'blue',
                      }}
                    >
                      {number}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchSelectComponent;
