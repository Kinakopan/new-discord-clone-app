import { useRef } from "react";
import styles from '../styles/Home.module.css';

function CreateChannel(props) {
  const channelInputRef = useRef();

  function createHandler() {
    const enteredChannel = channelInputRef.current.value;
    props.addNewChannel(enteredChannel);
  }

  return (
    <div className={styles.newChannel_cont}>
      <form onSubmit={createHandler}>
        <input
          className={styles.newChannel_input}
          style={{  marginRight: 15}}
          type="text"
          ref={channelInputRef}
          placeholder="New Channel Name"
        />
        <button className={styles.newChannel_input} style={{backgroundColor:"var(--quaternary-color)"}}>Create</button>
      </form>
    </div>
  );
}

export default CreateChannel;
