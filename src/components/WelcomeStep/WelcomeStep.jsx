import React from 'react';
import { useState } from 'react';
import SearchSelectComponent from '../SearchSelectComponent/SearchSelectComponent';
import PostalCodeInput from '../PostalCodeInput/PostalCodeInput';
const WelcomeStep = () => {
  const selecteditem = { key: '', value: [] };
  const title = ["Title 1", "Title 2", "Title 3", "Title 4", "Title 5"];
  const sourcelist = [
    { key: 1, value: ["abcd", "営業担当", "人事", "技術部", "総務"] },
    { key: 2, value: ["efg", "営業担当", "人事", "技術部", "総務"] },
    { key: 3, value: ["hij", "営業担当", "人事", "技術部", "総務"] },
    { key: 4, value: ["klm", "営業担当", "人事", "技術部", "総務"] },
    { key: 5, value: ["nop", "営業担当", "人事", "技術部", "総務"] },
    { key: 6, value: ["qrs", "営業担当", "人事", "技術部", "総務"] },
    { key: 7, value: ["tuv", "営業担当", "人事", "技術部", "総務"] },
    { key: 8, value: ["wxy", "営業担当", "人事", "技術部", "総務"] },
    { key: 9, value: ["zab", "営業担当", "人事", "技術部", "総務"] },
    { key: 10, value: ["cde", "営業担当", "人事", "技術部", "総務"] },
    { key: 11, value: ["fgh", "営業担当", "人事", "技術部", "総務"] },
    { key: 12, value: ["ijk", "営業担当", "人事", "技術部", "総務"] },
    { key: 13, value: ["lmn", "営業担当", "人事", "技術部", "総務"] },
    { key: 14, value: ["opq", "営業担当", "人事", "技術部", "総務"] },
    { key: 15, value: ["rst", "営業担当", "人事", "技術部", "総務"] },
    { key: 16, value: ["uvw", "営業担当", "人事", "技術部", "総務"] },
    { key: 17, value: ["xyz", "営業担当", "人事", "技術部", "総務"] },
    { key: 18, value: ["abc", "営業担当", "人事", "技術部", "総務"] },
    { key: 19, value: ["def", "営業担当", "人事", "技術部", "総務"] },
    { key: 20, value: ["ghi", "営業担当", "人事", "技術部", "総務"] },
    { key: 21, value: ["jkl", "営業担当", "人事", "技術部", "総務"] },
    { key: 22, value: ["mno", "営業担当", "人事", "技術部", "総務"] },
    { key: 23, value: ["pqr", "営業担当", "人事", "技術部", "総務"] },
    { key: 24, value: ["stu", "営業担当", "人事", "技術部", "総務"] },
    { key: 25, value: ["vwx", "営業担当", "人事", "技術部", "総務"] },
    { key: 26, value: ["yza", "営業担当", "人事", "技術部", "総務"] },
    { key: 27, value: ["bcd", "営業担当", "人事", "技術部", "総務"] },
    { key: 28, value: ["efg", "営業担当", "人事", "技術部", "総務"] },
    { key: 29, value: ["hij", "営業担当", "人事", "技術部", "総務"] },
    { key: 30, value: ["klm", "営業担当", "人事", "技術部", "総務"] }
  ];
  const [postalCode, setPostalCode] = useState('');

  const handlePostalCodeChange = (e) => {
    setPostalCode(e.target.value);
  };

  return (
    <div>
      <h2>Welcome Setup</h2>
      <SearchSelectComponent selecteditem={selecteditem} title={title} sourcelist={sourcelist} />

      <div>
      <PostalCodeInput value={postalCode} onChange={handlePostalCodeChange} />
      <p>入力された郵便番号: {postalCode}</p>
    </div>

    </div>
    
  );
};

export default WelcomeStep;
