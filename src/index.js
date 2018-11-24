import React from "react";
import ReactDOM from "react-dom";

const total_rows = 6;
const total_grids = 7;
function Circle(props) {
  // console.log("circle")
  // console.log(props.cell)
  let color = 'white';
  if (props.cell === 1) {
    color = 'Black'
  } else if(props.cell === 2) {
    // console.log('Reddd')
    color = 'Red'
  }
  let style ={
    backgroundColor: color,
    border: '1px solid black',
    borderRadius: '100%',
    paddingTop: '98%'
  }
  return (<div style={style}></div>)
}

function Grid(props) {
  // console.log("grid")
  // console.log(props.cell)
  let style = {
    backgroundColor: 'Yellow',
    border: '1px solid black',
    height: '50px',
    width: '50px'
  }
  return (
    <div style= {style} onClick={() => props.handleClick(props.row, props.col)}>
      <Circle cell={props.cell} />
    </div>
  )
}

function Row(props) {

  let style = {
    display: 'flex'
  }
  let grids = [];
  for (let i = 0; i < 7; i++) {
    grids.push(<Grid key={i} row={props.row} cell={props.cells[i]} col={i} handleClick={props.handleClick}/>)
  }
  return (
    <div style={style}>
      {grids}
    </div>
  )
}

function Board(props){
  console.log(props);
  let rows = [];
  for (let i = 0; i < 6; i++) {
    rows.push(<Row key={i} row={i} cells={props.cells[i]} handleClick={props.handleClick}/>)
  }
  return (
    <div>{rows}</div>
  )
}

class Game extends React.Component {
  // player_turn - 1: Black, 2:Red
  // cells: [][] - 0: empty, 1: Black, 2:red
  // winner - 0: none, 1:Black, 2:Red
  constructor(props){
    super(props);
    let cells = [];
    for(let i=0; i < 6; i++){
      cells.push(new Array(7).fill(0));
    }
    this.state = {
      player_turn: 1,
      cells: cells,
      winner: 0,
      message: 'Black Turn'
    };
    console.log(this.state);
    this.handleClick = this.handleClick.bind(this)
  }

  render(){
    return(
      <div>
        <h2>{this.state.message}</h2>
        <Board cells={this.state.cells} handleClick={this.handleClick}/>
        <button onClick={() => this.restart()}> Restart </button>
      </div>
    )
  }

  restart(){
    let cells = [];
    for(let i=0; i < 6; i++){
      cells.push(new Array(7).fill(0));
    }
    let new_state = {
      palyer_turn: 1,
      cells: cells,
      winner: 0,
      message: 'Black Turn'
    };
    this.setState(new_state);
  }

  handleClick(row, col){
    if (this.state.winner !== 0) {
      return 0;
    }
    let available_row = this.findAvaiableRow(row, col);
    console.log('available row1', available_row);
    if (available_row === -1) {
      return 0;
    }
    let temp = [];
    for(let i = 0; i < 6; i++){
      temp.push(this.state.cells[i].slice())
    }

    // this.setState({cells:temp})
    let turn = 1;
    let previous_turn = this.state.player_turn;
    let tmp_message = '';

    if (this.state.player_turn === 1) {
      temp[available_row][col] = 1;
      tmp_message = 'Red Turn'
      turn = 2
    } else {
      temp[available_row][col] = 2;
      tmp_message = 'Black Turn';
      turn = 1;
    }
    this.setState({cells:temp, player_turn: turn, message: tmp_message}, () => {
      let game_finished = this.checkGame(available_row, col, previous_turn);
      if (game_finished) {
        console.log('Game finished')
        tmp_message = previous_turn===1 ? 'Black won' : 'Red won';
        this.setState({winner: previous_turn, message: tmp_message});
      }
    });

  }

  checkGame(row, col, player){
    let params = [row, col, player];
    return (this.checkHorizontal(...params) || this.checkVertical(...params) || this.checkDiagonal(...params))
  }

  findAvaiableRow(row, col){
    console.log('total rows',total_rows)
    //console.log('available_row');
    console.log(row, col);
    //console.log(this.state.cells)
    for(let i = total_rows-1; i>= row;i--){
      if (this.state.cells[i][col] === 0) {
        console.log(i);
        return i;
      }
    }
    return -1;
  }

  checkHorizontal(row, col, player){
    // returns true if present else false
    console.log('checking horizontal ', row, col, player);
    if (this.invalidIndex(row, col)) {
      return false;
    }

    let left = this.min(0, col-3);
    let end = this.max(col+3, total_grids-1-3);
    // let start = 0;
    for(let i=left; i<=end; i++){
      if (this.state.cells[row][i] === player && this.state.cells[row][i+1] === player && this.state.cells[row][i+2] === player && this.state.cells[row][i+3] === player) {
        return true;
      }
    }


    return false;
  }

  checkVertical(row, col, player){
    console.log('checking vertical', row, col, player)
    if (this.invalidIndex(row, col)) {
      return false;
    }
    let top = this.max(0, row-3);
    let end = this.min(row+3, total_rows-1-3);
    console.log('top end', top, end)
    for (let i = top; i <= end; i++) {
      if (this.state.cells[i][col] === player && this.state.cells[i+1][col] === player && this.state.cells[i+2][col] === player && this.state.cells[i+3][col] === player) {
        return true;
      }
    }

    return false;
  }

  checkDiagonal(row, col, player){
    console.log('checking diagonal', row, col, player);
    if (this.invalidIndex(row, col)) {
      return false;
    }

    let min_i = 0;
    let max_i = 0;

    for(let i=0; i<=3; i++){
      if (!this.invalidIndex(row-i, col-i)) {
        min_i = -i;
      }
    }

    for(let i=0; i<=3; i++){
      if (!this.invalidIndex(row+i, col+i)) {
        max_i = i;
      }
    }
    console.log('mins 135', min_i, max_i);

    for(let i=min_i; i<=max_i-3; i++){
      if (this.state.cells[row+i][col+i] === player && this.state.cells[row+i+1][col+i+1] === player && this.state.cells[row+i+2][col+i+2] === player && this.state.cells[row+i+3][col+i+3] === player) {
        return true
      }
    }


    // check 45 degree daigonal

    min_i = 0;
    max_i = 0;

    for(let i=0; i<=3; i++){
      if (!this.invalidIndex(row-i, col+i)) {
        min_i = -i;
      }
    }

    for(let i=0; i<=3; i++){
      if (!this.invalidIndex(row+i, col-i)) {
        max_i = i;
      }
    }
    console.log('mins 45', min_i, max_i);
    for(let i=min_i; i<=max_i-3; i++){
      if (this.state.cells[row+i][col+i] === player && this.state.cells[row+i+1][col+i-1] === player && this.state.cells[row+i+2][col+i-2] === player && this.state.cells[row+i+3][col+i-3] === player) {
        return true
      }
    }

    return false;
  }

  invalidIndex(row, col){
    if (col < 0 || col >= total_grids || row < 0 || row >= total_rows) {
      return true;
    }
    return false;
  }

  min(a,b){
    return ( a > b ? b : a)
  }

  max(a,b){
    return ( a > b ? a : b)
  }
}

ReactDOM.render(
  <Game/>,
  document.getElementById('root')
)
