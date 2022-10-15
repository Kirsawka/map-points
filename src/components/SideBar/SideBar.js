import Selector from '../Selector/Selector';
import styles from './SideBar.module.css';

function SideBar({hideSideBar, address, titles, descriptions, getTitle, getDescription}) {

  return <aside className={styles.aside}>
    <h2 className={styles.subtitle}>Выберите адрес на карте</h2>
    <p>Адрес: {address} </p>
    <Selector name="title"
              optionTitle="Заголовок"
              options={titles}
              getValue={getTitle}/>
    <Selector name="description"
              optionTitle="Описание"
              options={descriptions}
              getValue={getDescription}/>
    <button className={styles.button} onClick={hideSideBar}>Добавить</button>
  </aside>
}

export default SideBar;
