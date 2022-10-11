import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "../constant/ItemType";
import UpArrow from "./svg/UpArrow";

const VideoTile = ({ id, imgSrc, title, avatarSrc, username, likes, index, moveCard }) => {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
      className="w-full flex justify-between items-center border-solid border-gray-700 border-2 rounded-2xl py-8 my-4"
    >
      <div className="flex w-2/4 pr-4 items-center">
        <p className="text-lg px-2">{`${index + 1 < 10 ? "0" : ""}${index + 1}`}</p>
        <img src={imgSrc} alt="" />
        <p className="text-xl text-white px-2">{title}</p>
      </div>
      <div className="flex items-center">
        <img src={avatarSrc} alt="" />
        <p className="text-lg text-white px-2">{username}</p>
      </div>
      <div className="flex px-8 items-center">
        <p className="text-lg">{likes}</p>
        <UpArrow />
      </div>
    </div>
  );
};

export default VideoTile;
