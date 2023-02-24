import React, { useEffect, useState } from "react";
import Styles from "../styles/displayScaleAndKey.module.css";
import { fetchKeyWithNote } from "../api";

const DisplayScaleAndKey = (props) => {
  const [displayResult, setDisplayResult] = useState([]);
  const array = props.array;

  const fetchData = async () => {
    //キーボードのデータを配列として受けとり、それを元にfetchKeyWithNoteを呼び出す
    const result = await fetchKeyWithNote(props.array);
    if (Object.values(result).length === 0) {
      setDisplayResult([]);
    } 

    for (let i = 0; i < result.length; i++) {
      //受け取ったデータを元に、表示する文字列を作成
      // const keyNum = result.data[i].key - 1;
      // const scaleNum = result.data[i].scale - 1;
      if (i === 0) {
        setDisplayResult([]);
      }
      setDisplayResult((prevState) => [
        ...prevState,
        // keys[keyNum] + "-" + scales[scaleNum],
        result.data[i].key + "-" + result.data[i].scale,
      ]);
    }
  };

  useEffect(() => {
    // fetchData();
  }, [array]);

  const list = displayResult.map((elm) => <p key={elm}>{elm}</p>);
  return (
    <div className={Styles.container}>
      <h1>Result</h1>
      {list}
    </div>
  );
};

export default DisplayScaleAndKey;
