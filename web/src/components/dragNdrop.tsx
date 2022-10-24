import React, { useState } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

export interface Dragid{
  draggableId:"item-1-1666642049889",
  type:"DEFAULT",
  source:{
    index:1,
    droppableId:"0"
  },
  reason:"DROP",
  mode:"FLUID",
  destination:{
    droppableId:"0",
    index:4
  },
  combine:null
}
export interface Item{
    id:string,
    content:string
}
// fake data generator
const getItems = (count: number) =>
  Array.from({ length: count }, (_, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
  }));

const reorder = (list: Item[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

function QuoteApp() {
  const [state, setState] = useState({
    items: getItems(10)
  }
  );

  function onDragEnd(result: DropResult) {
    const { source, destination } = result;
    // dropped outside the list
    if (!destination) {
      return;
    }
    // const sInd = +source.droppableId;
    const items = reorder(state.items, source.index, destination.index);
    // const newState = [...state.items];
 
    setState({
      items
    });

  }

  return (
    <div>
      <button
        type="button"
        onClick={() => {
        const items = [...state.items, {id: "1", content:"ass"}];

        setState({items});
        }}
      >
        Add new item
      </button>
      <div style={{ display: "flex" }}>
        
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, _) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {state.items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                  
                      >
                        {item.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<QuoteApp />, rootElement);
