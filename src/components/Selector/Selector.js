import styles from './Selector.module.css';

function Selector({name, optionTitle, options, getValue}) {
  return <select className={styles.select} name={name} onChange={(e) => getValue(e.target.value)}>
    <option>{optionTitle}</option>
    {options.map((option, index) => <option key={index} value={option.name}>{option.name}</option>)}
  </select>
}

export default Selector;
