import React, { useState, useEffect } from 'react';
import '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css';
import styles from './SearchSelectComponent.module.css';

const SearchSelectComponent = ({ selecteditem, title, sourcelist = [],onSelect  }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState(sourcelist);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    console.log('***sourcelist=',sourcelist);
    setSearchResults(sourcelist || []); // 当 sourcelist 发生变化时更新搜索结果
  }, [sourcelist]);

  useEffect(() => {
    if (selecteditem?.value) {
      setSearchValue(selecteditem.value); // 设置默认的搜索值
    }
  }, [selecteditem]);

  const handleOpenModal = () => {
    setIsModalOpen(true);

    // 使弹出窗口居中
    setPosition({
      x: (window.innerWidth - window.innerWidth * 0.8) / 2,
      y: (window.innerHeight - window.innerHeight * 0.9) / 2,
    });

    if (selecteditem?.value) {
      setSearchValue(selecteditem.value);
      handleSearchChange({ target: { value: selecteditem.value } });
    } else {
      setSearchResults(sourcelist); // 如果没有搜索值，显示所有结果
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    // 过滤结果
    const filteredResults = value
      ? sourcelist.filter((item) =>
          item.value.some((val) => val.includes(value))
        )
      : sourcelist; // 如果没有输入内容，显示所有结果

    setSearchResults(filteredResults);
    setCurrentPage(1);
  };

  const handleSelectItem = (item) => {
    if (onSelect) {
      console.log('**onSelect is called');
      onSelect({
        key: item.key,
        value: item.value, // 假设输入框需要显示第一列值
      });
    } else {
      console.warn('onSelect callback is not provided');
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

  const onMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const onMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const onMouseUp = () => {
    setDragging(false);
  };


  return (
    <div className={styles.searchSelectContainer}>
      <div className="slds-form-element">
        <div className={`${styles.inputContainer} slds-form-element__control`}>
          <input
            type="text"
            className={`${styles.searchInput} slds-input`}
            value={selecteditem?.value || ''} // 显示 selecteditem.value
            readOnly
            onClick={handleOpenModal}
            placeholder="検索..."
          />
          <span className={`${styles.searchIcon}`}>
            {/* 使用 Salesforce 的放大镜图标 */}
            <svg className="slds-icon slds-icon_x-small slds-icon-text-default" aria-hidden="true">
              <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
            </svg>
          </span>
        </div>
      </div>

      {isModalOpen && (
        <>
          <section
            role="dialog"
            tabIndex="-1"
            className="slds-modal slds-fade-in-open"
            aria-labelledby="modal-heading-01"
            aria-describedby="modal-content-id-1"
            style={{
              position: 'fixed',
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: '80%',
              height: '90%',
              overflow: 'hidden',
              zIndex: 1000,
            }}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
          >
            <div className="slds-modal__container">
              <header
                className="slds-modal__header"
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                style={{ cursor: 'move' }}
              >
                <button
                  className="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse"
                  title="閉じる"
                  onClick={handleCloseModal}
                >
                  <svg className="slds-button__icon slds-button__icon_large" aria-hidden="true">
                    <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                  </svg>
                  <span className="slds-assistive-text">閉じる</span>
                </button>
                <h2 className="slds-text-heading_medium" id="modal-heading-01">
                  選択項目
                </h2>
              </header>
              <div
                className="slds-modal__content slds-p-around_medium"
                id="modal-content-id-1"
                style={{ maxHeight: '100%', overflowY: 'auto' }}
              >
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
                <div style={{ marginTop: '10px' }}>
                  <table className="slds-table slds-table_cell-buffer slds-table_bordered">
                    <thead>
                      <tr>
                        {title.map((header, index) => (
                          <th key={index} scope="col">
                            <div className="slds-truncate" title={header} style={{ fontSize: '0.85rem' }}>
                              {header}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item, index) => (
                        <tr
                          key={index}
                          onClick={() => handleSelectItem(item)}
                          style={{ cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          {item.value.map((val, i) => (
                            <td key={i} data-label={title[i]}>
                              <div className="slds-truncate" title={val}>
                                {val}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {pageNumbers.length > 1 && (
                  <div className="slds-m-top_medium">
                    {pageNumbers.map((number) => (
                      <button
                        key={number}
                        className={`slds-button slds-button_neutral ${currentPage === number ? 'slds-is-selected slds-button_brand' : ''}`}
                        onClick={() => handlePageChange(number)}
                        style={{ margin: '2px', padding: '5px 10px', fontSize: '0.85rem' }}
                      >
                        {number}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <footer className="slds-modal__footer">
                <button className="slds-button slds-button_neutral" onClick={handleCloseModal}>
                  閉じる
                </button>
              </footer>
            </div>
          </section>
          <div className="slds-backdrop slds-backdrop_open" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}></div>
        </>
      )}
    </div>
  );
};

export default SearchSelectComponent;
