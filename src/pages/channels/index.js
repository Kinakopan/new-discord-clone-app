import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { getAllChannels } from "@/database";

function wait(seconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

export default function Channels() {
  const [channels, setChannels] = useState([])

  // useEffect(() => {
  //     // Anything in useEffect will definitely run on the client
  //     // in the browser
  //     wait(5).then(() => axios.get("/api/channels")
  //     .then((response) => {
  //         setChannelsState(response.data);
  //     }))
  // }, [channels])

  useEffect (()=> {
    // client side code --> run in the browser
    axios.get("/api/channels")
      .then((response) => {
        const channels = response.data
        setChannels(channels)
      })
  }, [channels])

  return (
    <div>
      <h1>Channels</h1>
      <ul>
        {channels.map((channel) => (
          <li key={channel.id}>
            <Link href={`/channels/${channel.id}`}>{channel.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  // runs on the server
  const channels = await getAllChannels();

  return {
    props: {
      channels: JSON.parse(JSON.stringify(channels)),
    },
  };
}
