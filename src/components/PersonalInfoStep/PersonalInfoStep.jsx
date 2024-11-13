import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import styles from './PersonalInfoStep.module.css'; // 使用 CSS Modules 导入
import SearchSelectComponent from '../SearchSelectComponent/SearchSelectComponent';

const roleOptions = [
  { label: '管理者', value: 'admin' },
  { label: '営業担当', value: 'sales' },
  { label: '採用担当', value: 'recruitment' },
  { label: 'プロジェクト責任者', value: 'projectLeader' },
  { label: '技術面接担当', value: 'techinterviewer' },
];

const PersonalInfoStep = () => {
  const [selectedRoles, setSelectedRoles] = React.useState([]);

  const selecteditem = { key: '', value: [] };
  const title = ["Title 1", "Title 2", "Title 3", "Title 4", "Title 5"];
  const sourcelist = [
    // 示例数据
    { key: 1, value: ["abcd", "営業担当", "人事", "技術部", "総務"] },
    { key: 2, value: ["efg", "営業担当", "人事", "技術部", "総務"] },
    // ...其余数据
  ];

  return (
    <div className={styles.personalInfoStep}>
      <div className={styles.personalErrorMessage}>
        エラーメッセージがあればここに表示。各項目のチェックはフォーム項目の上に表示する。
      </div>

      <div className={styles.personalFormRow}>
        <div className={styles.personalFormGroup}>
          <label htmlFor="last-name" className={styles.personalLabel}>姓:</label>
          <input type="text" id="last-name" className={styles.personalFormInput} />
        </div>
        <div className={styles.personalFormGroup}>
          <label htmlFor="first-name" className={styles.personalLabel}>名:</label>
          <input type="text" id="first-name" className={styles.personalFormInput} />
        </div>
      </div>

      <div className={styles.personalFormRow}>
        <div className={styles.personalFormGroup}>
          <label htmlFor="last-kana" className={styles.personalLabel}>姓カナ:</label>
          <input type="text" id="last-kana" className={styles.personalFormInput} />
        </div>
        <div className={styles.personalFormGroup}>
          <label htmlFor="first-kana" className={styles.personalLabel}>名カナ:</label>
          <input type="text" id="first-kana" className={styles.personalFormInput} />
        </div>
      </div>

      <div className={styles.personalFormRow}>
        <div className={styles.personalFormGroup}>
          <label htmlFor="email" className={styles.personalLabel}>メール:</label>
          <input type="email" id="email" className={styles.personalFormInput} />
        </div>
        <div className={styles.personalFormGroup}>
          <label htmlFor="phone" className={styles.personalLabel}>電話:</label>
          <input type="tel" id="phone" className={styles.personalFormInput} />
        </div>
      </div>

      <div className={styles.personalFormRow}>
        <div className={styles.personalFormGroup}>
          <label htmlFor="department" className={styles.personalLabel}>部署</label>
          <input type="text" id="department" className={styles.personalFormInput} />
        </div>
        <div className={styles.personalFormGroup}>
          <label htmlFor="manager" className={styles.personalLabel}>マネージャー</label>
          <SearchSelectComponent selecteditem={selecteditem} title={title} sourcelist={sourcelist} />
        </div>
      </div>

      <div className={styles.personalFormGroup}>
        <label htmlFor="role" className={styles.personalLabel}>ロール:</label>
        <Autocomplete
          multiple
          options={roleOptions}
          getOptionLabel={(option) => option.label}
          value={selectedRoles}
          onChange={(event, newValue) => setSelectedRoles(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="ロール"
              placeholder="選択してください"
              sx={{
                '& .MuiInputBase-root': { fontSize: '0.85rem' },
                '& .MuiFormLabel-root': { fontSize: '0.85rem' },
              }}
            />
          )}
          sx={{
            '& .MuiAutocomplete-tag': { fontSize: '0.85rem' },
            '& .MuiAutocomplete-option': { fontSize: '0.85rem' },
          }}
        />
      </div>
    </div>
  );
};

export default PersonalInfoStep;
