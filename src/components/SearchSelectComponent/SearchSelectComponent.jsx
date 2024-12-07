import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  InputAdornment,
  Typography,
  Pagination
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const SearchSelectComponent = ({
  selecteditemid,
  textDisplayField,
  tableTitle,
  searchColum,
  sourcelist = [],
  onSelect,
  onClear,
  title,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [innerSourceList, setInnerSourceList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [displayValue, setDisplayValue] = useState("");


  useEffect(() => {
    console.log('***searchselectconponent useeffect is called');
    const formatInnerSourceList = sourcelist.map((item) => {
      const formattedItem = {
        id: item.id,
        displayValue: textDisplayField.map((field) => item[field]).join(" "),
        searchValue: (tableTitle[searchColum] || [])
          .map((field) => item[field] || "")
          .join(" ")
          .toLowerCase(),
      };

      Object.keys(tableTitle).forEach((key) => {
        formattedItem[key] = (tableTitle[key] || [])
          .map((field) => item[field] || "")
          .join(" ");
      });

      return formattedItem;
    });

    setInnerSourceList(formatInnerSourceList);
    console.log('***formatInnerSourceList=',formatInnerSourceList);
    console.log('***selecteditemid=',selecteditemid);
    if (selecteditemid) {
      const selected = formatInnerSourceList.find(
        (item) => String(item.id) === String(selecteditemid)
      );
      if (selected) {
        console.log('**selected.displayValue=',selected.displayValue);
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
    setSearchValue("");
    setSearchResults(innerSourceList);
    setCurrentPage(1);
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

  const handleClear = () => {
    setDisplayValue("");
    if (onClear) onClear();
  };


  const handlePageChange = (event, page) => {
    setCurrentPage(page); // 这里正确传递页码
  };


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(searchResults.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <Box>
      {/* 输入框 */}
      <TextField
        label={title}
        value={displayValue}
        placeholder="検索..."
        fullWidth
        onClick={!displayValue ? handleOpenModal : undefined}
        size="small" 
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              {displayValue ? (
                <IconButton onClick={handleClear} edge="end">
                  <ClearIcon />
                </IconButton>
              ) : (
                <IconButton edge="end">
                  <SearchIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />

      {/* 模态框 */}
      <Dialog 
        open={isModalOpen} 
        onClose={handleCloseModal} 
        fullWidth
        maxWidth="sm" // 变窄
        sx={{ "& .MuiDialog-paper": { width: "50%", maxWidth: "none" } }} // 控制宽度
      >
        <DialogTitle>
          {title ? `${title}を選択してください` : '選択項目'}
          <IconButton
            onClick={handleCloseModal}
            style={{ position: "absolute", right: 16, top: 16 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* 搜索框 */}
          <TextField
            label="検索"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="検索ワードを入力してください"
            fullWidth
            margin="normal"
          />

          {/* 条数信息 */}
          <Typography variant="body2" style={{ marginBottom: "10px" ,marginTop: 16 }}>
            検索件数：{searchResults.length} 件
          </Typography>

          {/* 搜索结果列表 */}
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(tableTitle).map((key, index) => (
                  <TableCell key={index}>{key}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((item) => (
                <TableRow
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  style={{
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f5f5f5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  {Object.keys(tableTitle).map((key, index) => (
                    <TableCell key={index}>{item[key]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>    

          {searchResults.length > itemsPerPage && (
            <Box mt={2} display="flex" justifyContent="center">
              <Pagination
                count={Math.ceil(searchResults.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                siblingCount={1}
                boundaryCount={1}
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SearchSelectComponent;
