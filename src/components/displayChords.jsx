import styled from 'styled-components'

const DisplayChords = (props) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>I</th>
          <th>II</th>
          <th>III</th>
          <th>IV</th>
          <th>V</th>
          <th>VI</th>
          <th>VII</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>C</td>
          <td>D</td>
          <td>E</td>
          <td>F</td>
          <td>G</td>
          <td>A</td>
          <td>B</td>
        </tr>
        {/* <tr>
          <td>Row 2, Column 1</td>
          <td>Row 2, Column 2</td>
          <td>Row 2, Column 3</td>
        </tr> */}
      </tbody>
    </Table>
  )
}

export default DisplayChords

const Table = styled.table`
  border-collapse: collapse; /* テーブルの境界線を非表示にする */
  width: 80%;
  th,
  td {
    width: 5em;
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd; /* セルの下線を表示する */
  }
  th {
    background-color: #f2f2f2; /* ヘッダーの背景色を設定する */
    color: #555;
  }
`
