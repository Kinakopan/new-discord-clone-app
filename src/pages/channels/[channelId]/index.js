import { useState, useEffect } from "react";
import axios from "axios";
import Link from 'next/link';
import Image from 'next/image';
import styles from "@/styles/Home.module.css";
import { getAllChannels, getAllMessages, getChannelById } from "@/database";

function wait(seconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, seconds * 1000)
    })
}

export default function Channel({channels, channelName, channelId, messages: initialMessages}) {

    const [userName, setUserName] = useState('')
    const [text, setText] = useState('')
    const [messages, setMessages] = useState(initialMessages)
    const [newMessage, setNewMessage] = useState(initialMessages)
    const [content, setContent] = useState([])

    const handleSubmit = async (e) => {
      e.preventDefault()
      console.log('===submit===', userName, text);
      const result = await axios.post(`/api/channels/${channelId}/messages`, {
          userName, text
      })
      const newMessage = result.data
      setMessages([...messages, newMessage])
    }

    const handleServerClickSubmit = async (channelId)=> {
      console.log('===click channel===', channelId);
      const newResult = await axios.get(`/api/channels/${channelId}/messages`, {
          userName, text
      })
      const newMessage = newResult.data
      console.log(`===Updated newMessage is===:`, JSON.stringify(newResult.data))
      setMessages(newMessage)
      setNewMessage(newMessage)
    }

    // useEffect(() => {
    //   async function fetchMessages() {
    //     const messages = await getAllMessages(channelId)
    //     if (Object.keys(messages).length !== 0) {
    //       setMessages(messages)
    //     }
    //   }
    //   fetchMessages()
    // }, [channelId])

    useEffect(() => {
      async ()=> {
        setMessages(newMessage)
      }
    }, [messages])

    return (
      <div className={styles.wrapper}>
        <div className={styles.section_iconBar}></div>

        <div  className={styles.section_server_channel}>
          <div  className={styles.server}>
            <h2 className={styles.server_header}>
              Sever header Here
            </h2>
            <div className={styles.server_content}>
              <ul className={styles.server_channelsList}>
                  {channels.map((channel) => (
                      <li
                        className={styles.server_list}
                        key={channel.id}>
                        # <Link
                          className={styles.server_list_link}
                          href={`/channels/${channel.id}`}
                          onClick={()=>{handleServerClickSubmit(channel.id)}}
                          >
                          {channel.name}
                        </Link>
                      </li>
                  ))}
              </ul>

              <div className={styles.server_user}>

                <div className={styles.server_userInfo}>
                  <div className={styles.server_userImageBox}>
                    <Image
                      className={styles.server_userImage}
                      src="/images/dog.jpg"
                      alt="dog image"
                      width={50}
                      height={50}
                    />
                    <span className={styles.server_status}></span>
                  </div>

                  <ul className={styles.server_userNameBox}>
                    <li>Mio</li>
                    <li>#4444</li>
                  </ul>
                </div>

                <ul className={styles.server_userTool}>
                  <li>
                    <button className={styles.server_toolBtn}>
                      <Image
                        src="/icons/microphone.png"
                        alt="microphone icon"
                        width={18}
                        height={18}/>
                    </button>
                  </li>
                  <li>
                    <button className={styles.server_toolBtn}>
                      <Image
                        src="/icons/headphone.png"
                        alt="headphone icon"
                        width={18}
                        height={18}/>
                    </button>
                  </li>
                  <li>
                    <button className={styles.server_toolBtn}>
                      <Image
                        src="/icons/setting.png"
                        alt="setting icon"
                        width={18}
                        height={18}/>
                    </button>
                  </li>
                </ul>
              </div>

            </div>

          </div>

          <div className={styles.channel}>
            <h2 className={styles.channel_header}>
              #{channelId} {channelName}
            </h2>

            <div className={styles.channel_content}>
              <div className={styles.channel_display}>
              {messages.map((message) => (
                <div className={styles.channel_outputBox} key={message.id}>
                  <p>{message.text}</p>
                  <p>{message.userName}</p>
                </div>
              ))}

              </div>
              <form
                className={styles.channel_form}
                onSubmit={handleSubmit}>
                  <input
                    className={styles.channel_input}
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    />
                  <input
                    className={styles.channel_input}
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    />
                  <button
                    className={styles.channel_btn}
                    type="submit">Send</button>
              </form>
            </div>

            <div className={styles.status_content}>
            </div>

          </div>{/* section_server_channel */}
        </div>
      </div>
    )
}

export async function getServerSideProps(context) {
    // This is always server side
    // From the server, we can connect to the database
    const channels = await getAllChannels();
    const channelId = context.query.channelId
    const channel = await getChannelById(channelId);
    const channelName = channel.name;
    const messages = await getAllMessages(channelId);

    return {
        props: {
            channels: JSON.parse(JSON.stringify(channels)),
            channelName,
            channelId,
            messages: JSON.parse(JSON.stringify(messages))
        }
    }
}
