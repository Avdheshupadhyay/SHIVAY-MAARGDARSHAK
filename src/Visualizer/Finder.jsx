import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../Algorithms/Dijkstra';
import './Finder.css';

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      showMessage: true,
      startNode: { row: 4, col: 8 },
      finishNode: { row: 14, col: 21 },
      numRows: 18, // Default rows
      numCols: 36, // Default columns
    };
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });

    setTimeout(() => {
      this.setState({ showMessage: false });
    }, 2000);
  }

  getInitialGrid() {
    const { startNode, finishNode, numRows, numCols } = this.state;
    const grid = [];
    for (let row = 0; row < numRows; row++) {
      const currentRow = [];
      for (let col = 0; col < numCols; col++) {
        currentRow.push(this.createNode(col, row, startNode, finishNode));
      }
      grid.push(currentRow);
    }
    return grid;
  }

  createNode(col, row, startNode, finishNode) {
    return {
      col,
      row,
      isStart: row === startNode.row && col === startNode.col,
      isFinish: row === finishNode.row && col === finishNode.col,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  }

  handleMouseDown(row, col) {
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  getNewGridWithWallToggled(grid, row, col) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = { ...node, isWall: !node.isWall };
    newGrid[row][col] = newNode;
    return newGrid;
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const { grid, startNode, finishNode } = this.state;
    const start = grid[startNode.row][startNode.col];
    const finish = grid[finishNode.row][finishNode.col];
    const visitedNodesInOrder = dijkstra(grid, start, finish);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finish);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  handleInputChange(event, type) {
    const { value, name } = event.target;
    const newPosition = { ...this.state[type], [name]: parseInt(value) };
    this.setState({ [type]: newPosition }, () => {
      const grid = this.getInitialGrid();
      this.setState({ grid });
    });
  }

  handleGridSizeChange(event, type) {
    this.setState({ [type]: parseInt(event.target.value) });
  }

  updateGrid() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  render() {
    const { grid, mouseIsPressed, showMessage, startNode, finishNode, numRows, numCols } = this.state;

    if (showMessage) {
      return (
        <div className="message-container">
          <h1>Welcome to My SHIVAY Māargdarśhak</h1>
          <p>यात्रा आरम्भे विश्वासः।</p>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="controls">
          <div>
            <label>Start Node:</label>
            <input type="number" name="row" value={startNode.row} onChange={(e) => this.handleInputChange(e, 'startNode')} />
            <input type="number" name="col" value={startNode.col} onChange={(e) => this.handleInputChange(e, 'startNode')} />
          </div>
          <div>
            <label>Finish Node:</label>
            <input type="number" name="row" value={finishNode.row} onChange={(e) => this.handleInputChange(e, 'finishNode')} />
            <input type="number" name="col" value={finishNode.col} onChange={(e) => this.handleInputChange(e, 'finishNode')} />
          </div>
          <div className="grid-size">

            <label>Grid Rows:</label>
            <input type="number" value={numRows} onChange={(e) => this.handleGridSizeChange(e, 'numRows')} />
            <label>Grid Columns:</label>
            <input type="number" value={numCols} onChange={(e) => this.handleGridSizeChange(e, 'numCols')} />
            <button onClick={() => this.updateGrid()} className="update-grid-button">Update Grid</button>
          </div>
        </div>

        <button className="text" onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's Algorithm
        </button>
        
        <button className="refresh-button" onClick={() => window.location.reload()}>
          Refresh
        </button>

        <div className="grid">
          {grid.map((row, rowIdx) => (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const { row, col, isFinish, isStart, isWall } = node;
                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall}
                    mouseIsPressed={mouseIsPressed}
                    onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                    onMouseUp={() => this.handleMouseUp()}
                    row={row}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
